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
    case UPDATE_STREAM_LATEST_MESSAGE: {
      const newMessages = [...state.messages];
      if (newMessages.length > 0) {
        const lastMsg = { ...newMessages[newMessages.length - 1] };
        if (lastMsg.author.role === "agent") {
          lastMsg.content = action.payload; // Update streaming text
          newMessages[newMessages.length - 1] = lastMsg;
        }
      }
      return {
        ...state,
        messages: newMessages,
      };
    }
    default:
      return state;
  }
};

export default streamChatReducer;
