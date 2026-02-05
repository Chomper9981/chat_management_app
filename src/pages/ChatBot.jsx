import { Layout, Avatar, Button, Typography } from "antd";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { createChatBox, addChat } from "../action/actions";
import SearchBar from "../components/conversationComponents/SearchBar.jsx";
import ChatBoxContainer from "../components/conversationComponents/ChatBoxContainer.jsx";
import ConversationArea from "./ConversationArea.jsx";
import ChatSubmit from "../components/conversationComponents/ChatSubmit.jsx";
import "./Conversations.css";
import { useMemo } from "react";

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

const ChatBot = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { botId, conversationId } = useParams();
  const currentUser = useSelector((state) => state.auth.myInfo);
  const bots = useSelector((state) => state.bot.bots);
  const allChats = useSelector((state) => state.chat.chats || []);
  const chatBoxes = useSelector((state) => state.chatBox.chatBoxes);
  const currentBot = bots.find(
    (bot) => String(bot.id).trim() === String(botId).trim(),
  );

  // defaultMessage for new conversation
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

  // filter boxs
  const displayBoxs = useMemo(() => {
    const temp = chatBoxes.filter((box) => box.botId === botId);
    return temp;
  }, [botId, chatBoxes]);

  // filter messages
  const displayMessages = useMemo(() => {
    if (conversationId === "new") {
      return [defaultMessage];
    }
    const conversationMessages = allChats.filter(
      (chat) => chat.conversationId === conversationId,
    );
    return conversationMessages;
  }, [conversationId, allChats, defaultMessage]);

  const handleSendMessage = (text, chattingUser) => {
    if (!currentUser || !chattingUser) return;
    // new conversation
    if (conversationId === "new") {
      const newConversationId = uuidv4();

      // create chatBox
      const newChatBox = {
        id: newConversationId,
        botId: botId,
        botName: chattingUser.name,
        boxName: text,
        timestamp: new Date().toISOString(),
      };
      dispatch(createChatBox(newChatBox));

      // save new message to conversation
      const updatedDefaultMessage = {
        ...defaultMessage,
        conversationId: newConversationId,
      };
      const userMessage = {
        id: uuidv4(),
        conversationId: newConversationId,
        senderId: currentUser.id,
        receiverId: chattingUser.id,
        content: text,
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      dispatch(addChat(updatedDefaultMessage));
      dispatch(addChat(userMessage));
      navigate(`/dashboard/chatbot/${botId}/${newConversationId}`);
    } else {
      // old conversation
      const newMessage = {
        id: uuidv4(),
        conversationId: conversationId,
        senderId: currentUser.id,
        receiverId: chattingUser.id,
        content: text,
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      dispatch(addChat(newMessage));
    }
  };

  return (
    <Layout className="conversations-layout">
      <Sider width={300} className="conversations-sider">
        <Text
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeftOutlined />
          {currentBot?.name || "Chat Bot"}
        </Text>
        <Button
          className="new-chat-box"
          variant="dashed"
          onClick={() => {
            navigate(`/dashboard/chatbot/${botId}/new`);
          }}
        >
          Thêm mới
        </Button>
        <SearchBar
          //   onSearch={handleSearchChange}
          placeholder="Tìm kiếm cuộc hội thoại..."
        />
        <ChatBoxContainer chatBoxes={displayBoxs} />
      </Sider>

      <Layout className="conversations-main">
        <Header className="conversations-header">
          <Avatar
            className="chatting-avatar"
            icon={<UserOutlined />}
            src={currentBot.avatar}
          />
          <div className="chatting-info">
            <div className="chatting-name">{currentBot.name}</div>
            <small className="chatting-description">
              {currentBot.description}
            </small>
          </div>
        </Header>

        <Content className="conversations-content">
          <ConversationArea
            chattingUser={currentBot}
            newMessages={displayMessages}
            items={null}
          />
        </Content>

        <Footer className="conversations-footer">
          <ChatSubmit chattingUser={currentBot} onSend={handleSendMessage} />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ChatBot;
