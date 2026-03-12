import React, { useEffect, useMemo, useState } from "react";
import { Layout, Avatar, Typography, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
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

  const [isBotTyping, setIsBotTyping] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const conversationId = conversationInfo?.conversation_id || "";

  const baseUrl = import.meta.env.VITE_DEV_BASE_URL;

  // 1. Khởi tạo Agent và lấy thông tin phiên (Start API)
  useEffect(() => {
    const initChat = async () => {
      try {
        // Lấy convesation_id từ URL hoặc sinh mới (Ở đây demo dùng URL params botId)
        // Lưu ý: owlla-dev server yêu cầu agent_id và conversation_id
        const startRes = await fetch(
          `${baseUrl}api/chat-website/start?agent_id=${botId}&conversation_id=69b27020fee7d076c554b006`,
        );
        const startData = await startRes.json();
        dispatch(setStreamAgentInfo(startData));
        dispatch(setStreamConversationInfo(startData.conversation_info));

        // 2. Lấy lịch sử tin nhắn
        const historyRes = await fetch(
          `${baseUrl}api/chat-website/get-message?conversation_id=${startData.conversation_info.conversation_id}`,
        );
        const historyData = await historyRes.json();
        dispatch(setStreamMessages(historyData.data.messages || []));
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    if (baseUrl && botId) {
      initChat();
    }
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // Parse SSE format: event: ... \n data: ...
        const lines = chunk.split("\n");
        lines.forEach((line) => {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.replace("data: ", ""));
              if (data.content) {
                accumulatedText = data.content;
                setStreamingText(accumulatedText);
              }
            } catch {
              // Ignore parse errors for partial chunks
            }
          }
        });
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
          <ChatSubmit onSend={handleSendMessage} disabled={isBotTyping} />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ChatBotStream;
