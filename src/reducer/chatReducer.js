import { ADD_CHAT } from "../action/types";

const initialState = {
  chats: JSON.parse(localStorage.getItem("chats")) || [],
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CHAT: {
      const updatedChats = [...state.chats, action.payload];
      localStorage.setItem("chats", JSON.stringify(updatedChats));
      return { ...state, chats: updatedChats };
    }

    default:
      return state;
  }
};

export default chatReducer;
