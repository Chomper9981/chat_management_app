Dựa vào mã nguồn trong thư mục `MobiIframe` (bao gồm `index.js` và `ChatContainer.js`), tôi sẽ phân tích chi tiết luồng hoạt động của chatbot này, đặc biệt tập trung vào phần hoạt động realtime/streaming qua **Socket.IO**.
Kiến trúc ở đây được chia làm 2 tầng chính:

1. `MobiIframe` (trong `index.js`): Đóng vai trò là container cha. Nơi này quản lý việc định danh User (lưu thông tin ở `localStorage`: `INFOR_CHAT_IFRAME`), gọi API lấy danh sách hội thoại (`getDataMessages`), và cấu hình ban đầu của chatbot (`initializationChatbotIframe`).
2. `ChatContainer` (trong `ChatContainer.js`): Đảm nhiệm luồng giao tiếp chính của người dùng với Chatbot, render UI hiển thị tin nhắn, và đóng vai trò Core Controller cho Stream IO.
   Dưới đây là phân tích chuyên sâu về Luồng **Stream IO** trong `ChatContainer.js`.

**Luồng Stream IO (Socket.IO) trong `ChatContainer`**
Hoạt động Stream được thực hiện qua giao thức WebSockets với thư viện `socket.io-client`. Luồng này chia làm 4 giai đoạn chính:

**1. Khởi tạo kết nối (Connection Initialization)**
Khi người dùng chuyển đỗi hội thoại (nhảy vào một `oneMessage` mới), một `useEffect` sẽ ngắt kết nối cũ và tạo một kết nối mới:

`socket.current = io(BASE_URL, {
  path: '/socket.io/socket.io', 
  transports: ['websocket'], // Ép buộc dùng chuẩn websocket ngay từ đầu (giúp giảm độ trễ)
  query: { 'verify': false }
});
handleSocketEvents(); // Gọi hàm đăng kí các sự kiện lắng nghe stream`

Mục đích: Đảm bảo mỗi khi đổi session/hội thoại là một luồng Socket độc lập và clean, tránh việc bị double sự kiện. Khi component unmount, `socket.current.disconnect()` sẽ được gọi để dọn dẹp.

**2. Luồng gửi câu hỏi (Emit Message)**
Khi user nhập câu hỏi và submit (hàm `sendMessageChat` hoặc click vào các câu hỏi gợi ý qua hàm `sendMessageChatHintQuestion`):
**- Cập nhật UI cục bộ:** Ngay lập tức push tin nhắn của "human" vào mảng State `messages` để render lên màn hình ngay mà không cần đợi server confirm. Đồng thời cuộn màn hình xuống dưới cùng.
**- Emit sự kiện:** Bắn sự kiện `chatbot_message` lên server với payload gửi kèm đầy đủ ngữ cảnh hiện tại.

`let data = {
  type: 'question',
  is_conversation_exists: idConversation !== 'new' && idConversation !== '',
  conversation_id: idConversation === 'new' ? '' : idConversation, // Nếu là hội thoại mới thì rỗng
  text: txtMessage,
  is_iframe: true,
  chatbot_id: id,
  user_info_iframe: { user_name: props?.inforChat }, // UUID của user
};
socket.current.emit('chatbot_message', data);`
Join Room: Nếu đã có `idConversation`, lập tức emit thêm sự kiện `join_conversation_user_chatbot` giúp server đưa socket này vào vào đúng "phòng" chứa mã cuộc hội thoại để nhận Stream.

**3. Luồng nhận Stream dữ liệu trả về (Receive Stream)**
Logic hứng dữ liệu stream nằm chủ yếu ở hàm `handleSocketEvents()` lắng nghe sự kiện `chatbot_message` trả về từ server:
**- Chặn UI (Typing state):** Khi có message bắt đầu Stream về, hệ thống đặt `setIsCheck(true)` và `setPause(true)` để hiển thị hiệu ứng Loading "..." và hiển thị nút Pause gõ.
**- Cập nhật Conversation ID mới:** Nếu đây là lần chat đầu tiên, server sẽ sinh ra `conversation_id` mới và trả qua Socket. Máy khách nhận ID này gán ngược lại vào logic.
**- Xử lý nội dung Stream (Chunk Accumulation):**
**+ Dựa trên cách code viết:** Phía Frontend không chủ động thực hiện chuỗi cộng dồn string (kiểu `prev += data.text`), mà thay vào đó server sẽ gửi nguyên đoạn text tích luỹ dần (Accumulated Text) tại mỗi nhịp stream thông qua object `receivedData`.
**+ Nó lấy toàn bộ receivedData nhét vào biến State độc lập typingText:**

`if (receivedData?.sender === 'bot' && receivedData?.type !== 'follow_up_question') {
    setTypingText(receivedData); 
    // ... cuộn chuột xuống
}`

- Biến `typingText` này được hiển thị đè ở cuối danh sách bên dưới thẻ `<MarkdownRendererNew>` (Xem phần JSX dưới cùng). Mỗi lần nhận chunk, văn bản lại bị đè và dài ra tạo cảm giác "bot đang gõ".
  **- Chờ Tín hiệu dừng Stream (End Stream):** Server sẽ báo hiệu đoạn stream đã gõ xong toàn bộ bằng Cờ `is_end: true`. Khi nhận chunk cuối cùng có cờ này:
- Code sẽ tắt trạng thái Loading.
- Một `useEffect` phụ lắng nghe sự thay đổi của typingText sẽ kích hoạt:

`useEffect(() => {
  if (typingText?.is_end === true) {
    setPause(false);
    setIsCheck(false);
    if (typingText?.type !== 'error') {
      setMessages([...messages, typingText]); // Chốt câu trả lời cuối, push hẳn vào mảng chính
    }
    setTypingText(null); // Xoá biến tạm
  }
}, [typingText]);`

4. Handle Dữ liệu phụ đi kèm (Follow-up & Pause)
   **- Câu hỏi gợi ý (Follow Up Questions):** Trong lúc stream hoặc khi kết thúc stream, server có thể bắn về các object type là `follow_up_question`. Các giá trị text này sẽ được Frontend push thẳng vào một mảng `hintQuestion`.

`if (receivedData?.type === 'follow_up_question') {
  setHintQuestion((prev) => [...prev, receivedData.text]);
}`

Sau đó, các câu hỏi này sẽ mọc ra dưới dạng "bong bóng nổi" ở dưới bottom UI để người dùng có thể nhấn vào chat tiếp.
**- Trạng thái Pause Generation:** Trong quá trình bot đang stream text, icon gửi tin nhắn chuyển thành icon dấu Pause. Nếu user click Pause (hàm `pauseMessageChat()`), frontend sẽ emit một sự kiện `socket.current.emit('pause_completion', { pause: true })`. Server nhận được sẽ tự triệt tiêu Generator và bắn nốt chunk cuối cùng kèm cờ `is_end` để dừng UI gõ.
**Tổng kết**
Luồng IO ở đây vận hành cực kỳ tối ưu cho mô hình LLMs / AI gen text. Cách tách rời Data State của lịch sử `messages` ra khỏi State đang gõ `typingText` là một design pattern hiệu quả để hiển Markdown mượt bé mà không khiến toàn bộ array State bị re-render liên tục. Socket ở đây chỉ chịu tác vụ real-time duy nhất cho current action tương tác (emit text -> lắng nghe text typing về -> emit pause nếu cần). Hiển thị lịch sử cũ sẽ phụ thuộc hoàn toàn vào API REST ban đầu.
