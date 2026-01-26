import { LOGIN_SUCCESS, LOGOUT, ADD_MESSAGE, MARK_MESSAGES_AS_READ } from './types';

// Action để lưu thông tin user sau khi login thành công
export const loginSuccess = (userInfo) => ({
  type: LOGIN_SUCCESS,
  payload: userInfo,
});

// Action để logout
export const logout = () => {
  // Xóa token hoặc user data khỏi localStorage nếu có
  localStorage.removeItem('userInfo');
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