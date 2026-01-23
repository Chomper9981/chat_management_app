import { LOGIN_SUCCESS, LOGOUT } from '../action/types';

// Initial state
const initialState = {
  myInfo: null,
  isAuthenticated: false,
};

// Kiểm tra localStorage khi khởi tạo
const savedUserInfo = localStorage.getItem('userInfo');
if (savedUserInfo) {
  try {
    const parsedInfo = JSON.parse(savedUserInfo);
    initialState.myInfo = parsedInfo;
    initialState.isAuthenticated = true;
  } catch (error) {
    console.error('Error parsing saved user info:', error);
  }
}

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      // Lưu vào localStorage để persist data
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      return {
        ...state,
        myInfo: action.payload,
        isAuthenticated: true,
      };

    case LOGOUT:
      localStorage.removeItem('userInfo');
      return {
        ...state,
        myInfo: null,
        isAuthenticated: false,
      };

    default:
      return state;
  }
};

export default loginReducer;