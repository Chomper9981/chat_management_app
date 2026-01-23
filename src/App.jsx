import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Conversations from "./pages/Conversations.jsx";
import ConversationsArea from "./pages/ConversationArea.jsx";
import Profile from "./pages/Profile.jsx";
import PrivateRoute from "./components/shared/PrivateRoute.jsx"; 

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* ==================== PUBLIC ROUTES ==================== */}
          {/* Không cần đăng nhập */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* ==================== PRIVATE ROUTES ==================== */}
          {/* BẮT BUỘC phải đăng nhập */}
          
          {/* Route: /conversations */}
          <Route 
            path="/conversations" 
            element={
              <PrivateRoute>
                <Conversations />
              </PrivateRoute>
            }
          >
            {/* Nested Route: /conversations/:userId */}
            <Route path=":userId" element={<ConversationsArea />} />
          </Route>
          
          {/* Route: /profile */}
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          
          {/* ==================== 404 ==================== */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;