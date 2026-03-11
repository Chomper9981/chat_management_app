import {
  ADD_CHAT,
  SET_CONVERSATION_MESSAGES,
  CLEAR_CONVERSATION_OF_DELETED_CHATBOX,
} from "../action/types";

const initialState = {
  chats: JSON.parse(localStorage.getItem("chats")) || [],
  currentConversationMessages: [],
};

const saveChatsToStorage = (chats) => {
  // TODO: Khi chuyển sang API, thay localStorage bằng API call ở đây
  localStorage.setItem("chats", JSON.stringify(chats));
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CHAT: {
      const newChat = action.payload;
      const targetConvId = newChat.conversationId;

      let updatedChats = [...state.chats, newChat];

      // Đếm số lượng tin nhắn của cuộc hội thoại hiện tại
      const targetChatsCount = updatedChats.filter(chat => chat.conversationId === targetConvId).length;

      // Nếu vượt quá 30, lọc bỏ từ từ những tin nhắn cũ nhất từ đầu mảng để không làm sai lệch phần còn lại
      if (targetChatsCount > 30) {
        let itemsToRemove = targetChatsCount - 30;
        updatedChats = updatedChats.filter(chat => {
          if (chat.conversationId === targetConvId && itemsToRemove > 0) {
            itemsToRemove--;
            return false;
          }
          return true;
        });
      }

      saveChatsToStorage(updatedChats);

      // Tự động cập nhật currentConversationMessages nếu đang mở đúng cuộc hội thoại
      const shouldUpdateCurrent =
        state.currentConversationMessages.length > 0 &&
        state.currentConversationMessages[0]?.conversationId === targetConvId;
      
      const updatedCurrentMessages = shouldUpdateCurrent
        ? updatedChats.filter(chat => chat.conversationId === targetConvId)
        : state.currentConversationMessages;

      return {
        ...state,
        chats: updatedChats,
        currentConversationMessages: updatedCurrentMessages,
      };
    }

    case SET_CONVERSATION_MESSAGES: {
            return {
        ...state,
        currentConversationMessages: action.payload,
      };
    }

    case CLEAR_CONVERSATION_OF_DELETED_CHATBOX: {
      const filteredMessages = state.chats.filter(
        (message) => message.conversationId !== action.payload
      );
      saveChatsToStorage(filteredMessages);
            return {
        ...state,
        chats: filteredMessages,
        currentConversationMessages: [],
      };
    }

    default:
      return state;
  }
};

export default chatReducer;
