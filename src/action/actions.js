import { LOGIN_SUCCESS, LOGOUT } from './types';

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