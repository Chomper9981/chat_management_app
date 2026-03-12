import { Layout, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import {
  addChat,
  setConversationMessages,
  createIframeBox,
} from "../action/actions";
import ConversationArea from "./ConversationArea.jsx";
import ChatSubmit from "../components/conversationComponents/ChatSubmit.jsx";
import "./Conversations.css";
import { useMemo, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const { Header, Content, Footer } = Layout;

const ChatbotIframe = () => {
  const dispatch = useDispatch();
  const { botId } = useParams();

  const currentUser = useSelector((state) => state.auth.myInfo);
  const bots = useSelector((state) => state.bot.bots);

  const currentConversationMessages = useSelector(
    (state) => state.chat.currentConversationMessages || [],
  );

  const currentBot = bots.find(
    (bot) => String(bot.id).trim() === String(botId).trim(),
  );

  const [isBotTyping, setIsBotTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");

  const [inforChat] = useState(() => {
    const userInfor =
      JSON.parse(localStorage.getItem("INFOR_CHAT_IFRAME")) ?? null;
    if (userInfor) return userInfor.user_name;
    const idUser = uuidv4().replace(/-/g, "");
    localStorage.setItem(
      "INFOR_CHAT_IFRAME",
      JSON.stringify({ user_name: idUser }),
    );
    return idUser;
  });

  const iframeBoxes = useSelector(
    (state) => state.iframeBox?.iframeBoxes || [],
  );
  //1
  const mappedBox = useMemo(() => {
    return iframeBoxes.find(
      (box) => box.inforChat === inforChat && box.botId === String(botId),
    );
  }, [iframeBoxes, inforChat, botId]);

  const [conversationId, setConversationId] = useState(
    mappedBox ? mappedBox.conversationId : "new",
  );

  const socketRef = useRef(null);

  const defaultMessage = useMemo(
    () => ({
      id: uuidv4(),
      conversationId: "new",
      senderId: currentBot?.id,
      receiverId: currentUser?.id,
      content: "👋Xin chào! Tôi có thể giúp gì cho bạn không?",
      createdAt: new Date().toISOString(),
    }),
    [currentBot?.id, currentUser?.id],
  );
  //2
  const [tempMessages, setTempMessages] = useState([defaultMessage]);

  const conversationIdRef = useRef(conversationId);
  const tempMessagesRef = useRef(tempMessages);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    tempMessagesRef.current = tempMessages;
  }, [tempMessages]);

  // Hook khởi tạo kết nối Socket.IO
  useEffect(() => {
    socketRef.current = io(
      import.meta.env.VITE_BASE_URL || "http://localhost:8089",
      {
        path: "/socket.io/socket.io",
        transports: ["websocket"],
        query: { verify: false },
      },
    );

    // Lắng nghe sự kiện trả lời từ Bot
    socketRef.current.on("chatbot_message", (data) => {
      const receivedData = data;

      //3
      if (receivedData.conversation_id && conversationIdRef.current === "new") {
        const newId = receivedData.conversation_id;

        //4
        setConversationId(newId);
        dispatch(
          createIframeBox({
            inforChat: inforChat,
            botId: String(botId),
            conversationId: newId,
          }),
        );

        //5
        const messagesToFlush = tempMessagesRef.current;
        messagesToFlush.forEach((msg) => {
          const mappedMsg = { ...msg, conversationId: newId };
          dispatch(addChat(mappedMsg));
        });

        setTempMessages([]);
      }

      receivedData.content = receivedData.text;
      receivedData.createdAt = receivedData.created_at;

      if (
        receivedData?.sender === "bot" &&
        receivedData?.type !== "follow_up_question"
      ) {
        setIsBotTyping(true);
        setStreamingMessage(receivedData.content);

        //6
        if (receivedData?.is_end) {
          setIsBotTyping(false);
          if (receivedData?.type !== "error") {
            const activeId =
              receivedData.conversation_id || conversationIdRef.current;
            const botMessage = {
              id: receivedData.id || uuidv4(),
              conversationId: activeId,
              senderId: currentBot?.id,
              receiverId: currentUser?.id,
              content: receivedData.content,
              createdAt: receivedData.createdAt || new Date().toISOString(),
              isRead: false,
            };
            dispatch(addChat(botMessage));
          }
          setStreamingMessage("");
        }
      }

      // chưa xử lí đối với follow up questions
      if (receivedData?.type === "follow_up_question") {
        console.log("Follow up question:", receivedData.text);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentBot, currentUser, dispatch, inforChat, botId]);

  useEffect(() => {
    if (conversationId !== "new") {
      const allChats = JSON.parse(localStorage.getItem("chats")) || [];
      const conversationMessages = allChats.filter(
        (chat) => chat.conversationId === conversationId,
      );
      dispatch(setConversationMessages(conversationMessages));
    } else {
      dispatch(setConversationMessages([]));
    }
  }, [conversationId, dispatch]);

  const displayMessages = useMemo(() => {
    const messages =
      conversationId === "new"
        ? [...tempMessages]
        : [...currentConversationMessages];

    // bot stream
    if (isBotTyping && streamingMessage) {
      messages.push({
        id: "streaming",
        conversationId: conversationId,
        senderId: currentBot?.id,
        receiverId: currentUser?.id,
        content: streamingMessage,
        createdAt: new Date().toISOString(),
        isStreaming: true,
      });
    }
    return messages;
  }, [
    tempMessages,
    currentConversationMessages,
    isBotTyping,
    streamingMessage,
    conversationId,
    currentBot,
    currentUser,
  ]);

  const handleSendMessage = async (text, chattingUser) => {
    if (!currentUser || !chattingUser) return;

    const userMessage = {
      id: uuidv4(),
      conversationId: conversationId,
      senderId: currentUser?.id || inforChat,
      receiverId: chattingUser.id,
      content: text,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    if (conversationId === "new") {
      //2
      setTempMessages((prev) => [...prev, userMessage]);
    } else {
      //7
      dispatch(addChat(userMessage));
    }

    //3
    if (socketRef.current) {
      // Cấu hình payload theo backend
      socketRef.current.emit("chatbot_message", {
        type: "question",
        is_conversation_exists: conversationId !== "new",
        conversation_id: conversationId === "new" ? "" : conversationId,
        text: text,
        is_iframe: true,
        chatbot_id: botId,
        user_info_iframe: { user_name: inforChat },
        is_refresh_iframe: false,
        session_id:
          sessionStorage.getItem("CHAT_SESSION_ID") ||
          (() => {
            const sid = uuidv4().replace(/-/g, "");
            sessionStorage.setItem("CHAT_SESSION_ID", sid);
            return sid;
          })(),
      });

      //4
      if (conversationId !== "new") {
        socketRef.current.emit("join_conversation_user_chatbot", {
          conversation_id: conversationId,
        });
      }
    }
  };

  return (
    <Layout className="conversations-layout">
      <Layout className="conversations-main">
        <Header className="conversations-header">
          <Avatar
            className="chatting-avatar"
            icon={<UserOutlined />}
            src={currentBot?.avatar}
          />
          <div className="chatting-info">
            <div className="chatting-name">{currentBot?.name}</div>
            <small className="chatting-description">
              {currentBot?.description}
            </small>
          </div>
        </Header>

        <Content className="conversations-content">
          <ConversationArea
            chattingUser={currentBot}
            newMessages={displayMessages}
            items={null}
          />
          {isBotTyping && !streamingMessage && (
            <div className="typing-indicator">
              <span>{currentBot?.name} đang nhập...</span>
            </div>
          )}
        </Content>

        <Footer className="conversations-footer">
          <ChatSubmit
            chattingUser={currentBot}
            onSend={handleSendMessage}
            disabled={isBotTyping}
          />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ChatbotIframe;
