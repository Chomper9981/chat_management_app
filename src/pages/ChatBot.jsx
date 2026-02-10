import { Layout, Avatar, Button, Typography } from "antd";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import {
  createChatBox,
  addChat,
  deleteChatBox,
  renameChatBox,
  setConversationMessages,
  clearConversationDeletedChatBox,
} from "../action/actions";
import SearchBar from "../components/conversationComponents/SearchBar.jsx";
import ChatBoxContainer from "../components/conversationComponents/ChatBoxContainer.jsx";
import ConversationArea from "./ConversationArea.jsx";
import ChatSubmit from "../components/conversationComponents/ChatSubmit.jsx";
import "./Conversations.css";
import { useMemo, useState, useEffect } from "react";

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

const ChatBot = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { botId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const conversationId = searchParams.get("message") || "new";
  const currentUser = useSelector((state) => state.auth.myInfo);
  const bots = useSelector((state) => state.bot.bots);
  const currentConversationMessages = useSelector(
    (state) => state.chat.currentConversationMessages || [],
  );
  const chatBoxes = useSelector((state) => state.chatBox.chatBoxes);
  const currentBot = bots.find(
    (bot) => String(bot.id).trim() === String(botId).trim(),
  );
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const [isBotTyping, setIsBotTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");

  // defaultMessage for new conversation
  const defaultMessage = useMemo(
    () => ({
      id: uuidv4(),
      conversationId: "new",
      senderId: currentBot?.id,
      receiverId: currentUser?.id,
      content: "👋Xin chào! Tôi có thể giúp gì cho bạn không?",
      createdAt: new Date().toISOString(),
    }),
    [currentBot?.id, currentUser?.id],
  );

  // filter boxs
  const displayBoxs = useMemo(() => {
    const temp = chatBoxes.filter((box) => box.botId === botId);
    return temp;
  }, [botId, chatBoxes]);

  // Load messages khi conversationId thay đổi
  useEffect(() => {
    if (conversationId === "new") {
      // Conversation mới → chỉ có welcome message
      dispatch(setConversationMessages([defaultMessage]));
    } else {
      // Conversation cũ → load từ localStorage
      const allChats = JSON.parse(localStorage.getItem("chats")) || [];
      const conversationMessages = allChats.filter(
        (chat) => chat.conversationId === conversationId,
      );

      dispatch(setConversationMessages(conversationMessages));
    }
  }, [conversationId, defaultMessage, dispatch]);

  // Auto-navigate nếu conversationId không hợp lệ (đã bị xóa)
  useEffect(() => {
    if (
      conversationId !== "new" &&
      !displayBoxs.some((box) => box.id === conversationId)
    ) {
      navigate(`/dashboard/chatbot/${botId}?message=new`);
    }
  }, [conversationId, displayBoxs, botId, navigate]);

  // // filter messages
  // const displayMessages = useMemo(() => {
  //   if (conversationId === "new") {
  //     return [defaultMessage];
  //   }
  //   const conversationMessages = allChats.filter(
  //     (chat) => chat.conversationId === conversationId,
  //   );
  //   return conversationMessages;
  // }, [conversationId, allChats, defaultMessage]);
  const displayMessages = useMemo(() => {
    const messages = [...currentConversationMessages];

    // Thêm streaming message tạm vào cuối
    if (isBotTyping && streamingMessage) {
      messages.push({
        id: "streaming",
        conversationId: conversationId,
        senderId: currentBot?.id,
        receiverId: currentUser?.id,
        content: streamingMessage, // ← Text đang stream
        createdAt: new Date().toISOString(),
        isStreaming: true, // ← Flag đánh dấu đang stream
      });
    }

    return messages;
  }, [
    currentConversationMessages,
    isBotTyping,
    streamingMessage,
    conversationId,
    currentBot,
    currentUser,
  ]);

  const handleSendMessage = async (text, chattingUser) => {
    if (!currentUser || !chattingUser) return;
    // new conversation
    if (conversationId === "new") {
      const newConversationId = uuidv4();

      // create chatBox
      const newChatBox = {
        id: newConversationId,
        botId: botId,
        botName: chattingUser.name,
        boxName: text,
        timestamp: new Date().toISOString(),
      };
      dispatch(createChatBox(newChatBox));

      // save new message to conversation
      const updatedDefaultMessage = {
        ...defaultMessage,
        conversationId: newConversationId,
      };
      const userMessage = {
        id: uuidv4(),
        conversationId: newConversationId,
        senderId: currentUser.id,
        receiverId: chattingUser.id,
        content: text,
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      dispatch(addChat(updatedDefaultMessage));
      dispatch(addChat(userMessage));

      navigate(`/dashboard/chatbot/${botId}?message=${newConversationId}`);

      // Bot reply stream
      await mockBotStreamReply(text, newConversationId);
    } else {
      // old conversation
      const newMessage = {
        id: uuidv4(),
        conversationId: conversationId,
        senderId: currentUser.id,
        receiverId: chattingUser.id,
        content: text,
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      dispatch(addChat(newMessage));

      //Bot reply stream
      await mockBotStreamReply(text, conversationId);
    }
  };

  const handleSelectBox = (boxId) => {
    setRenamingId(null);
    navigate(`/dashboard/chatbot/${botId}?message=${boxId}`);
  };

  const handleStartRename = (box) => {
    setRenamingId(box.id);
    setRenameValue(box.boxName || "");
  };

  const handleRenameChange = (value) => {
    setRenameValue(value);
  };

  const handleRenameSubmit = (e, boxId) => {
    e.preventDefault();
    e.stopPropagation();
    if (renameValue.trim()) {
      dispatch(renameChatBox(boxId, renameValue.trim()));
    }
    setRenamingId(null);
  };

  const handleRenameBlur = () => {
    setRenamingId(null);
  };

  const handleDeleteBox = (boxId) => {
    dispatch(deleteChatBox(boxId));
    dispatch(clearConversationDeletedChatBox(boxId));
  };

  // Mock bot stream reply
  const mockBotStreamReply = async (userMessage, currentConversationId) => {
    // mẫu
    const botResponses = [
      "Cảm ơn bạn đã nhắn tin! Tôi đã nhận được câu hỏi của bạn.",
      "Để tôi kiểm tra thông tin này cho bạn nhé.",
      "Tôi có thể giúp bạn với yêu cầu đó.",
      "Hỏi ít thôi.",
      "Bạn nói gì cơ?",
      "Cái này em chưa học.",
    ];

    const botFullResponse =
      botResponses[Math.floor(Math.random() * botResponses.length)];
    const words = botFullResponse.split(" ");

    // Reset state
    setIsBotTyping(true); // ← Bật typing indicator
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStreamingMessage("");

    // Stream từng từ
    for (let i = 0; i < words.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 150)); // Delay 150ms
      setStreamingMessage((prev) => prev + (i === 0 ? "" : " ") + words[i]);
    }

    // Hoàn thành stream → tạo message thật
    const botMessage = {
      id: uuidv4(),
      conversationId: currentConversationId,
      senderId: currentBot?.id,
      receiverId: currentUser?.id,
      content: botFullResponse,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    dispatch(addChat(botMessage));

    // Tắt stream
    setIsBotTyping(false);
    setStreamingMessage("");
  };
  
  return (
    <Layout className="conversations-layout">
      <Sider width={300} className="conversations-sider">
        <Text
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeftOutlined />
          {currentBot?.name || "Chat Bot"}
        </Text>
        <Button
          className="new-chat-box"
          variant="dashed"
          onClick={() => {
            navigate(`/dashboard/chatbot/${botId}?message=new`);
          }}
        >
          Thêm mới
        </Button>
        <SearchBar
          //   onSearch={handleSearchChange}
          placeholder="Tìm kiếm cuộc hội thoại..."
        />
        <ChatBoxContainer
          chatBoxes={displayBoxs}
          activeConversationId={conversationId}
          renamingId={renamingId}
          renameValue={renameValue}
          onSelect={handleSelectBox}
          onStartRename={handleStartRename}
          onRenameChange={handleRenameChange}
          onRenameSubmit={handleRenameSubmit}
          onRenameBlur={handleRenameBlur}
          onDelete={handleDeleteBox}
          isBotTyping={isBotTyping}
          
        />
      </Sider>

      <Layout className="conversations-main">
        <Header className="conversations-header">
          <Avatar
            className="chatting-avatar"
            icon={<UserOutlined />}
            src={currentBot?.avatar}
          />
          <div className="chatting-info">
            <div className="chatting-name">{currentBot?.name}</div>
            <small className="chatting-description">
              {currentBot?.description}
            </small>
          </div>
        </Header>

        <Content className="conversations-content">
          <ConversationArea
            chattingUser={currentBot}
            newMessages={displayMessages}
            items={null}
          />
          {/* ← MỚI: Typing indicator khi chưa có text */}
          {isBotTyping && !streamingMessage && (
            <div className="typing-indicator">
              <span>{currentBot?.name} đang nhập...</span>
            </div>
          )}
        </Content>

        <Footer className="conversations-footer">
          <ChatSubmit
            chattingUser={currentBot}
            onSend={handleSendMessage}
            disabled={isBotTyping}
            
          />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ChatBot;
