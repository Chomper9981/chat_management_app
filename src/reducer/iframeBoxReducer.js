import { CREATE_IFRAME_BOX } from "../action/types";

const initialState = {
  iframeBoxes: JSON.parse(localStorage.getItem("iframeBoxes")) || [],
};

const iframeBoxReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_IFRAME_BOX: {
      const newBox = action.payload; // { conversationId, inforChat, botId }
      
      // Filter out any existing box with the same botId and inforChat to replace it
      const existingBoxes = state.iframeBoxes.filter(
        (box) => !(box.inforChat === newBox.inforChat && box.botId === newBox.botId)
      );
      
      const updatedBoxes = [...existingBoxes, newBox];
      
      localStorage.setItem("iframeBoxes", JSON.stringify(updatedBoxes));
      
      return {
        ...state,
        iframeBoxes: updatedBoxes,
      };
    }

    default:
      return state;
  }
};

export default iframeBoxReducer;
