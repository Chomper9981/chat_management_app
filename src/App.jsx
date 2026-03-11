import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import ConversationsArea from "./pages/ConversationArea.jsx";
import Profile from "./pages/profile.jsx";
import PrivateRoute from "./components/shared/PrivateRoute.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import LayOut from "./pages/LayOut.jsx";
import Conversations from "./pages/Conversations.jsx";
import ChatBot from "./pages/ChatBot.jsx";
import CreateBot from "./pages/CreateBot.jsx";
import ChatbotIframe from "./pages/ChatbotIframe.jsx";
  
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<LayOut />}>
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

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashBoard />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/chatbot/:botId"
              element={
                <PrivateRoute>
                  <ChatBot />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/create-bot"
              element={
                <PrivateRoute>
                  <CreateBot />
                </PrivateRoute>
              }
            />

            {/* STANDALONE IFRAME ROUTE */}
            <Route
              path="/bot-iframe/:botId"
              element={
                <PrivateRoute>
                  <ChatbotIframe />
                </PrivateRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
