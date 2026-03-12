import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Layout,
  Avatar,
  Typography,
  Space,
  Button,
  Modal,
  message,
} from "antd";
import { io } from "socket.io-client";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  setStreamAgentInfo,
  setStreamMessages,
  addStreamMessage,
  setStreamConversationInfo,
} from "../action/actions";
import ConversationArea from "./ConversationArea.jsx";
import ChatSubmit from "../components/conversationComponents/ChatSubmit.jsx";
import "./Conversations.css";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const ChatBotStream = () => {
  const { botId } = useParams();
  const dispatch = useDispatch();

  const { agentInfo, conversationInfo, messages } = useSelector(
    (state) => state.streamChat,
  );

  const socketRef = useRef(null);

  const [isBotTyping, setIsBotTyping] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const conversationId = conversationInfo?.conversation_id || "";

  const baseUrl = import.meta.env.VITE_DEV_BASE_URL;

  // 1. Khởi tạo Agent và lấy thông tin phiên (Start API)
  useEffect(() => {
    const initChat = async () => {
      try {
        // Bước 2: Lấy conversation_id đã lưu từ localStorage (nếu có)
        const savedConvId = localStorage.getItem(`${botId}_CONVERSATION_ID`);

        const startUrl = new URL(`${baseUrl}api/chat-website/start`);
        startUrl.searchParams.append("agent_id", botId);
        if (savedConvId) {
          startUrl.searchParams.append("conversation_id", savedConvId);
        }

        const startRes = await fetch(startUrl.toString());
        const startData = await startRes.json();
        const apiConvId = startData.conversation_info?.conversation_id;
        const apiSessId = startData.conversation_info?.session_id;

        // Bước 2: Lưu lại vào localStorage với tên đặc thù
        if (apiConvId) {
          localStorage.setItem(`${botId}_CONVERSATION_ID`, apiConvId);
        }
        if (apiSessId) {
          localStorage.setItem(`${botId}_SESSION_ID`, apiSessId);
        }

        dispatch(setStreamAgentInfo(startData));
        dispatch(setStreamConversationInfo(startData.conversation_info));

        // Bước 3: Khởi tạo Socket.IO namespace /chat-iframe
        // Sử dụng baseUrl (VITE_DEV_BASE_URL) cho socket đồng bộ với API
        socketRef.current = io(`${baseUrl}chat-iframe`, {
          path: "/socket.io/socket.io",
          transports: ["websocket"],
          query: { verify: false },
        });

        socketRef.current.on("connect", () => {
          console.log("Socket connected to /chat-iframe");
          // Emit join_conversation_iframe
          socketRef.current.emit("join_conversation_iframe", {
            agent_id: botId,
            conversation_id: apiConvId,
          });
        });

        // 2. Lấy lịch sử tin nhắn
        if (apiConvId) {
          const historyRes = await fetch(
            `${baseUrl}api/chat-website/get-message?conversation_id=${apiConvId}`,
          );
          const historyData = await historyRes.json();
          dispatch(setStreamMessages(historyData.data.messages || []));
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    if (baseUrl && botId) {
      initChat();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [baseUrl, botId, dispatch]);

  // Transform messages to match ConversationArea expected format
  const displayMessages = useMemo(() => {
    const transformed = messages.map((msg) => ({
      id: msg._id,
      content: msg.content,
      senderId: msg.author.role === "agent" ? botId : "user",
      receiverId: msg.author.role === "agent" ? "user" : botId,
      createdAt: msg.created_at,
    }));

    if (isBotTyping && streamingText) {
      transformed.push({
        id: "streaming",
        content: streamingText,
        senderId: botId,
        receiverId: "user",
        createdAt: new Date().toISOString(),
        isStreaming: true,
      });
    }
    return transformed;
  }, [messages, botId, isBotTyping, streamingText]);

  // 3. Hàm xử lý gửi tin nhắn dùng Stream Reader
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Thêm tin nhắn user vào Redux ngay
    const userMsgId = uuidv4();
    dispatch(
      addStreamMessage({
        _id: userMsgId,
        content: text,
        author: { role: "user" },
        created_at: new Date().toISOString(),
      }),
    );

    setIsBotTyping(true);
    setStreamingText("");

    try {
      const response = await fetch(`${baseUrl}api/chat-website/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id: botId,
          content: text,
          conversation_id: conversationId,
          section_id: conversationInfo?.session_id,
          attachments: [],
          type_message: "text",
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // SSE format xử lý: lọc theo từng cụm event/data
        const blocks = buffer.split("\n\n");
        // Giữ lại phần chưa hoàn thiện ở cuối buffer
        buffer = blocks.pop() || "";

        for (const block of blocks) {
          const lines = block.split("\n");
          let currentEvent = "";
          
          for (const line of lines) {
            if (line.startsWith("event: ")) {
              currentEvent = line.replace("event: ", "").trim();
            } else if (line.startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              try {
                const data = JSON.parse(dataStr);
                
                if (currentEvent === "message") {
                  if (data.content) {
                    accumulatedText = data.content;
                    setStreamingText(accumulatedText);
                  }
                } else if (currentEvent === "end") {
                  if (data.content) {
                    accumulatedText = data.content;
                  }
                  // Kết thúc sớm nếu gặp event: end
                  setIsBotTyping(false);
                }
              } catch (parseError) {
                console.error("Parse error for chunk:", dataStr, parseError);
              }
            }
          }
        }
      }

      // Sau khi kết thúc tất cả chunks, kiểm tra nếu buffer còn dữ liệu (trường hợp không kết thúc bằng \n\n)
      if (buffer.trim()) {
        const lines = buffer.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.replace("data: ", "").trim());
              if (data.content) accumulatedText = data.content;
            } catch (error) {
              console.error("Final buffer parse error:", error);
            }
          }
        }
      }

      // Khi stream kết thúc, lưu tin nhắn bot vào Redux
      dispatch(
        addStreamMessage({
          _id: uuidv4(),
          content: accumulatedText,
          author: { role: "agent" },
          created_at: new Date().toISOString(),
        }),
      );
    } catch (error) {
      console.error("Streaming error:", error);
    } finally {
      setIsBotTyping(false);
      setStreamingText("");
    }
  };

  // 4. Hàm xóa cuộc hội thoại
  const handleClearChat = async () => {
    if (!conversationId) return;

    Modal.confirm({
      title: "Xóa lịch sử trò chuyện?",
      content:
        "Hành động này sẽ xóa toàn bộ tin nhắn và khởi tạo lại phiên mới.",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          // Gọi API Clear trên Server
          await fetch(`${baseUrl}api/chat-website/clear-message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conversation_id: conversationId }),
          });

          // Xóa LocalStorage
          localStorage.removeItem(`${botId}_CONVERSATION_ID`);
          localStorage.removeItem(`${botId}_SESSION_ID`);

          // Ngắt socket cũ
          if (socketRef.current) {
            socketRef.current.disconnect();
          }

          // Reset Redux và gọi lại Init
          dispatch(setStreamMessages([]));
          dispatch(setStreamAgentInfo(null));
          dispatch(setStreamConversationInfo(null));

          // Re-init (useEffect sẽ tự chạy lại nếu ta có cơ chế trigger hoặc đơn giản là gọi lại hàm)
          window.location.reload(); // Cách đơn giản nhất để reset sạch mọi thứ

          message.success("Đã xóa lịch sử thành công");
        } catch (error) {
          console.error("Clear chat error:", error);
          message.error("Có lỗi xảy ra khi xóa");
        }
      },
    });
  };

  return (
    <Layout className="conversations-layout">
      <Layout className="conversations-main">
        <Header className="conversations-header">
          <Avatar
            className="chatting-avatar"
            icon={<UserOutlined />}
            src={
              agentInfo?.avatar_uri ? `${baseUrl}${agentInfo.avatar_uri}` : null
            }
          />
          <div className="chatting-info">
            <div className="chatting-name">
              {agentInfo?.name || "ChatBot Stream"}
            </div>
            <div className="chatting-description">
              {/* <div dangerouslySetInnerHTML={{ __html: agentInfo?.prologue }} /> */}
            </div>
          </div>
          <Button
            type="text"
            icon={
              <DeleteOutlined style={{ color: "#ff4d4f", fontSize: "20px" }} />
            }
            onClick={handleClearChat}
            title="Xóa cuộc hội thoại"
          />
        </Header>

        <Content className="conversations-content">
          <ConversationArea
            chattingUser={{ id: botId, name: agentInfo?.name }}
            newMessages={displayMessages}
          />

          {/* Opening Questions */}
          {messages.length === 0 &&
            agentInfo?.opening_questions?.length > 0 && (
              <div
                className="opening-questions-container"
                style={{ padding: "0 20px" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {agentInfo.opening_questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="opening-question-item"
                      onClick={() => handleSendMessage(q)}
                      style={{
                        padding: "8px 16px",
                        border: "1px solid #d9d9d9",
                        borderRadius: "16px",
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        fontSize: "13px",
                      }}
                    >
                      {q}
                    </div>
                  ))}
                </Space>
              </div>
            )}

          {isBotTyping && !streamingText && (
            <div className="typing-indicator">
              <span>Đang trả lời...</span>
            </div>
          )}
        </Content>

        <Footer className="conversations-footer">
          <ChatSubmit
            onSend={handleSendMessage}
            disabled={isBotTyping}
            chattingUser={{ id: botId, name: agentInfo?.name }}
          />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ChatBotStream;
