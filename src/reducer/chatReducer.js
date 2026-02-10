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
      const updatedChats = [...state.chats, action.payload];

      saveChatsToStorage(updatedChats);

      // Tự động cập nhật currentConversationMessages nếu cùng conversationId
      const shouldUpdateCurrent =
        state.currentConversationMessages.length > 0 &&
        state.currentConversationMessages[0]?.conversationId ===
          action.payload.conversationId;
      const updatedCurrentMessages = shouldUpdateCurrent
        ? [...state.currentConversationMessages, action.payload]
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
