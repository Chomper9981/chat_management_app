import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Conversations from "./pages/Conversations.jsx";
import ConversationsArea from "./pages/ConversationArea.jsx";
import Profile from "./pages/profile.jsx";
import PrivateRoute from "./components/shared/PrivateRoute.jsx";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* PRIVATE ROUTES */}
          <Route
            path="/conversations"
            element={
              <PrivateRoute>
                <Conversations />
              </PrivateRoute>
            }
          >
            <Route path=":userId" element={<ConversationsArea />} />
          </Route>

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
