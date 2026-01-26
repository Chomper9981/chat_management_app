import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * PrivateRoute - Bảo vệ các route yêu cầu đăng nhập
 * 
 * Cách dùng:
 * <Route 
 *   path="/conversations" 
 *   element={<PrivateRoute><ConversationsPage /></PrivateRoute>} 
 * />
 */
const PrivateRoute = ({ children }) => {
  // Lấy auth state từ Redux
  const { isAuthenticated, myInfo } = useSelector((state) => state.auth);
  
  // Kiểm tra localStorage làm backup (trường hợp refresh page)
  const userInfoInStorage = localStorage.getItem('userInfo');
  
  // User được coi là đã đăng nhập nếu:
  // 1. Redux state isAuthenticated = true, HOẶC
  // 2. Có myInfo trong Redux, HOẶC
  // 3. Có userInfo trong localStorage
  const isLoggedIn = isAuthenticated || myInfo || userInfoInStorage;
  
  // Debug log (có thể xóa sau khi test xong)
  console.log('🔐 PrivateRoute check:', {
    isAuthenticated,
    hasMyInfo: !!myInfo,
    hasStorage: !!userInfoInStorage,
    finalDecision: isLoggedIn ? '✅ ALLOW ACCESS' : '❌ REDIRECT to /login',
  });
  
  // Nếu chưa đăng nhập, redirect về /login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // Nếu đã đăng nhập, hiển thị component
  return children;
};

export default PrivateRoute;