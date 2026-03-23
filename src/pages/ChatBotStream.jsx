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
import { UserOutlined, DeleteOutlined, RobotOutlined } from "@ant-design/icons";
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
  const currentUser = useSelector((state) => state.auth.myInfo);
  const currentUserId = currentUser?.id || "user";

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [isBotTyping, setIsBotTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState(null);
  const conversationId = conversationInfo?.conversation_id || "";

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const messagesCount = messages.length;

  // Scroll khi tin nhắn thay đổi hoặc đang stream
  useEffect(() => {
    if (messagesCount > 0 || streamingMessage) {
      scrollToBottom();
    }
  }, [messagesCount, streamingMessage]);

  // Scroll ngay lập tức khi load xong lịch sử (behavior: auto)
  useEffect(() => {
    if (messagesCount > 0) {
      scrollToBottom("auto");
    }
  }, [messagesCount > 0]); // Tránh dùng complex expression trực tiếp nếu lint báo lỗi, nhưng ở đây ta dùng variable

  const baseUrl = import.meta.env.VITE_DEV_BASE_URL;

  // 1. Khởi tạo Agent và lấy thông tin phiên (Start API)
  useEffect(() => {
    const initChat = async () => {
      try {
        // Bước 1: Lấy conversation_id và session_id đã lưu từ localStorage
        const savedConvId = localStorage.getItem(`${botId}_CONVERSATION_ID`);

        const startUrl = new URL(
          `${baseUrl}api/chat-website/start`,
          window.location.origin,
        );
        startUrl.searchParams.append("agent_id", botId);
        if (savedConvId) {
          startUrl.searchParams.append("conversation_id", savedConvId);
        }

        const startRes = await fetch(startUrl.toString());
        const startData = await startRes.json();

        const apiConvId = startData.conversation_info?.conversation_id;
        const apiSessId = startData.conversation_info?.session_id;

        // Bước 2: Lưu lại vào localStorage
        if (apiConvId) {
          localStorage.setItem(`${botId}_CONVERSATION_ID`, apiConvId);
        }
        if (apiSessId) {
          localStorage.setItem(`${botId}_SESSION_ID`, apiSessId);
        }

        dispatch(setStreamAgentInfo(startData));
        dispatch(setStreamConversationInfo(startData.conversation_info));

        // Bước 3: Khởi tạo Socket.IO namespace /chat-iframe
        if (!socketRef.current) {
          socketRef.current = io(`${baseUrl}chat-iframe`.replace("//", "/"), {
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
        }

        // 2. Lấy lịch sử tin nhắn nếu đã có conversation_id từ trước
        if (apiConvId && savedConvId) {
          const historyRes = await fetch(
            `${baseUrl}api/chat-website/get-message?conversation_id=${apiConvId}`,
          );
          const historyData = await historyRes.json();
          const rawMessages = historyData.data.messages || [];

          // Map raw messages to internal format if necessary, or keep as is if compatible
          dispatch(setStreamMessages(rawMessages));
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
        socketRef.current = null;
      }
    };
  }, [baseUrl, botId, dispatch]);

  // Transform messages to match ConversationArea expected format
  const displayMessages = useMemo(() => {
    const transformed = messages.map((msg) => ({
      id: msg._id,
      content: msg.content,
      senderId: msg.author.role === "agent" ? botId : currentUserId,
      receiverId: msg.author.role === "agent" ? currentUserId : botId,
      createdAt: msg.created_at,
    }));

    if (isBotTyping && streamingMessage) {
      transformed.push(streamingMessage);
    }
    return transformed;
  }, [messages, botId, isBotTyping, streamingMessage, currentUserId]);

  // 3. Hàm xử lý gửi tin nhắn dùng Stream Reader
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Thêm tin nhắn user vào Redux ngay
    const userMsgId = uuidv4();
    const userMsg = {
      _id: userMsgId,
      content: text,
      author: { role: "user" },
      created_at: new Date().toISOString(),
    };
    dispatch(addStreamMessage(userMsg));

    setIsBotTyping(true);
    setStreamingMessage(null);

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
                    setStreamingMessage({
                      id: "streaming",
                      content: accumulatedText,
                      senderId: botId,
                      receiverId: currentUserId,
                      createdAt: new Date().toISOString(),
                      isStreaming: true,
                    });
                  }
                } else if (currentEvent === "end") {
                  if (data.content) {
                    accumulatedText = data.content;
                  }
                  // Commit bot message to Redux only on 'end'
                  dispatch(
                    addStreamMessage({
                      _id: data._id || uuidv4(),
                      content: accumulatedText,
                      author: { role: "agent" },
                      created_at: new Date().toISOString(),
                    }),
                  );
                  setIsBotTyping(false);
                  setStreamingMessage(null);
                }
              } catch (parseError) {
                console.error("Parse error for chunk:", dataStr, parseError);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
    } finally {
      setIsBotTyping(false);
      setStreamingMessage(null);
    }
  };

  // 4. Hàm xóa cuộc hội thoại
  const handleClearChat = async () => {
    if (!conversationId) return;

    Modal.confirm({
      title: "Xóa cuộc hội thoại?",
      content:
        "Hành động này sẽ xóa toàn bộ tin nhắn và khởi tạo lại phiên mới.",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await fetch(`${baseUrl}api/chat-website/clear-message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conversation_id: conversationId }),
          });

          localStorage.removeItem(`${botId}_CONVERSATION_ID`);
          localStorage.removeItem(`${botId}_SESSION_ID`);

          if (socketRef.current) {
            socketRef.current.disconnect();
          }

          dispatch(setStreamMessages([]));
          dispatch(setStreamAgentInfo(null));
          dispatch(setStreamConversationInfo(null));

          window.location.reload();
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
          <Space size={14}>
            <div style={{ position: "relative" }}>
              <Avatar
                size={42}
                icon={<RobotOutlined />}
                src={
                  agentInfo?.avatar_uri
                    ? `${baseUrl}${agentInfo.avatar_uri}`
                    : null
                }
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
                }}
              />
              {/* <div
                style={{
                  position: "absolute",
                  bottom: 1,
                  right: 1,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#22c55e",
                  border: "2px solid #fff",
                }}
              /> */}
            </div>
            <div className="chatting-info">
              <span className="chatting-name">
                {agentInfo?.name || "NexusAI Assistant"}
              </span>
              <span className="chatting-description">
                {messages.length === 0
                  ? "Sẵn sàng hỗ trợ bạn"
                  : "Đang hoạt động"}
              </span>
            </div>
          </Space>

          <Button
            className="clear-chat-btn"
            type="text"
            icon={<DeleteOutlined />}
            onClick={handleClearChat}
          >
            <span>Xoá</span>
          </Button>
        </Header>

        <Content className="conversations-content">
          {messages.length === 0 ? (
            <div className="welcome-container">
              <div className="welcome-header">
                <Avatar
                  size={80}
                  icon={<RobotOutlined />}
                  src={
                    agentInfo?.avatar_uri
                      ? `${baseUrl}${agentInfo.avatar_uri}`
                      : null
                  }
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)",
                    boxShadow: "0 8px 40px rgba(99, 102, 241, 0.35)",
                    marginBottom: 20,
                  }}
                />
                <h3>Xin chào! Tôi là {agentInfo?.name || "NexusAI"}</h3>
                <span className="welcome-subtitle">
                  Chọn một câu hỏi bên dưới hoặc nhập nội dung bạn cần
                </span>
              </div>

              {agentInfo?.opening_questions?.length > 0 && (
                <div className="opening-questions-stack">
                  {agentInfo.opening_questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="opening-question-card"
                      onClick={() => handleSendMessage(q)}
                    >
                      {q}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <ConversationArea
                chattingUser={{
                  id: botId,
                  name: agentInfo?.name,
                  avatar: agentInfo?.avatar_uri
                    ? `${baseUrl}${agentInfo.avatar_uri}`
                    : null,
                }}
                newMessages={displayMessages}
              />
              {isBotTyping && !streamingMessage && (
                <div className="typing-indicator">
                  <span>{agentInfo?.name || "Bot"} đang nhập...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </Content>

        <Footer className="conversations-footer">
          <ChatSubmit
            onSend={handleSendMessage}
            disabled={isBotTyping}
            chattingUser={{ id: botId, name: agentInfo?.name }}
            placeholder="Nhập tin nhắn của bạn..."
          />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ChatBotStream;
