import { ADD_CONVERSATION, REMOVE_CONVERSATION, LOGOUT } from "../action/types";

// Lấy dữ liệu từ localStorage
const savedConversations = localStorage.getItem("savedConversations");
const initialState = {
  conversationIds: savedConversations ? JSON.parse(savedConversations) : [],
};

const conversationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CONVERSATION: {
      // Kiểm tra xem userId đã có trong danh sách chưa
      if (state.conversationIds.includes(action.payload)) {
        return state; // Đã có rồi thì không thêm nữa
      }
      
      const updatedConversations = [...state.conversationIds, action.payload];
      localStorage.setItem("savedConversations", JSON.stringify(updatedConversations));
      
      return {
        ...state,
        conversationIds: updatedConversations,
      };
    }

    case REMOVE_CONVERSATION: {
      const updatedConversations = state.conversationIds.filter(
        (id) => id !== action.payload
      );
      localStorage.setItem("savedConversations", JSON.stringify(updatedConversations));
      
      return {
        ...state,
        conversationIds: updatedConversations,
      };
    }

    case LOGOUT: {
      // Khi logout, xóa danh sách conversations
      localStorage.removeItem("savedConversations");
      return {
        ...state,
        conversationIds: [],
      };
    }

    default:
      return state;
  }
};

export default conversationReducer;