import {
  CREATE_CHATBOX,
  UPDATE_CHATBOX_NAME,
  DELETE_CHATBOX,
} from "../action/types";

const initialState = {
  chatBoxes: JSON.parse(localStorage.getItem("chatBoxs")) || [],
};

const chatboxReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CHATBOX: {
      const updatedBoxes = [...state.chatBoxes, action.payload];
      localStorage.setItem("chatBoxs", JSON.stringify(updatedBoxes));
      return {
        ...state,
        chatBoxes: updatedBoxes,
      };
    }

    case UPDATE_CHATBOX_NAME: {
      const { boxId, newBoxName } = action.payload;
      const updatedBoxes = state.chatBoxes.map((box) =>
        box.id === boxId ? { ...box, boxName: newBoxName } : box,
      );

      localStorage.setItem("chatBoxs", JSON.stringify(updatedBoxes));
      return {
        ...state,
        chatBoxes: updatedBoxes,
      };
    }

    case DELETE_CHATBOX: {
      const filteredBoxes = state.chatBoxes.filter(
        (box) => box.id !== action.payload,
      );
      localStorage.setItem("chatBoxs", JSON.stringify(filteredBoxes));
      return {
        ...state,
        chatBoxes: filteredBoxes,
      };
    }

    default:
      return state;
  }
};

export default chatboxReducer;
