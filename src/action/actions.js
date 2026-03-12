import {
  LOGIN_SUCCESS,
  LOGOUT,
  ADD_MESSAGE,
  MARK_MESSAGES_AS_READ,
  DELETE_MESSAGE,
  REGISTER_SUCCESS,
  ADD_CONVERSATION,
  REMOVE_CONVERSATION,
  CREATE_CHATBOX,
  UPDATE_CHATBOX_NAME,
  DELETE_CHATBOX,
  ADD_CHAT,
  SET_CONVERSATION_MESSAGES,
  CLEAR_CONVERSATION_OF_DELETED_CHATBOX,
  CREATE_IFRAME_BOX,
  SET_STREAM_AGENT_INFO,
  SET_STREAM_MESSAGES,
  ADD_STREAM_MESSAGE,
  UPDATE_STREAM_LATEST_MESSAGE,
  SET_STREAM_CONVERSATION_INFO,
} from "./types";

// Action để lưu thông tin user sau khi login thành công
export const loginSuccess = (userInfo) => ({
  type: LOGIN_SUCCESS,
  payload: userInfo,
});

// Action để logout
export const logout = () => {
  // Xóa token hoặc user data khỏi localStorage nếu có
  localStorage.removeItem("userInfo");
  return {
    type: LOGOUT,
  };
};

export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});

export const markMessagesAsRead = (userId, currentUserId) => ({
  type: MARK_MESSAGES_AS_READ,
  payload: { userId, currentUserId },
});

export const deleteMessage = (messageId) => ({
  type: DELETE_MESSAGE,
  payload: messageId,
});

export const registerSuccess = (account) => ({
  type: REGISTER_SUCCESS,
  payload: account,
});

export const addConversation = (userId) => ({
  type: ADD_CONVERSATION,
  payload: userId,
});

export const removeConversation = (userId) => ({
  type: REMOVE_CONVERSATION,
  payload: userId,
});

export const createChatBox = (chatBox) => ({
  type: CREATE_CHATBOX,
  payload: chatBox,
});

export const addChat = (chat) => ({
  type: ADD_CHAT,
  payload: chat,
});

export const deleteChatBox = (chatBoxId) => ({
  type: DELETE_CHATBOX,
  payload: chatBoxId,
});

export const renameChatBox = (chatBoxId, newBoxName) => ({
  type: UPDATE_CHATBOX_NAME,
  payload: { boxId: chatBoxId, newBoxName },
});

export const setConversationMessages = (messages) => ({
  type: SET_CONVERSATION_MESSAGES,
  payload: messages
});

export const clearConversationDeletedChatBox = (chatBoxId) => ({
  type: CLEAR_CONVERSATION_OF_DELETED_CHATBOX,
  payload: chatBoxId
});

export const createIframeBox = (boxConfig) => ({
  type: CREATE_IFRAME_BOX,
  payload: boxConfig
});

export const setStreamAgentInfo = (agentInfo) => ({
  type: SET_STREAM_AGENT_INFO,
  payload: agentInfo
});

export const setStreamMessages = (messages) => ({
  type: SET_STREAM_MESSAGES,
  payload: messages
});

export const addStreamMessage = (message) => ({
  type: ADD_STREAM_MESSAGE,
  payload: message
});

export const updateStreamLatestMessage = (content) => ({
  type: UPDATE_STREAM_LATEST_MESSAGE,
  payload: content
});

export const setStreamConversationInfo = (conversationInfo) => ({
  type: SET_STREAM_CONVERSATION_INFO,
  payload: conversationInfo
});
