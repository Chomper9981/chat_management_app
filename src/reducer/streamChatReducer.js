import {
  SET_STREAM_AGENT_INFO,
  SET_STREAM_MESSAGES,
  ADD_STREAM_MESSAGE,
  UPDATE_STREAM_LATEST_MESSAGE,
  SET_STREAM_CONVERSATION_INFO,
} from "../action/types";

const initialState = {
  agentInfo: null,
  conversationInfo: null,
  messages: [], // { _id, content, author: { role }, created_at }
};

const streamChatReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STREAM_AGENT_INFO:
      return {
        ...state,
        agentInfo: action.payload,
      };
    case SET_STREAM_CONVERSATION_INFO:
      return {
        ...state,
        conversationInfo: action.payload,
      };
    case SET_STREAM_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };
    case ADD_STREAM_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    default:
      return state;
  }
};

export default streamChatReducer;
