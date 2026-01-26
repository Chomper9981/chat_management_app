import { useState } from "react";
import { Layout, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import UserCardContainer from "./UserCardContainer.jsx";
import ConversationArea from "../../pages/ConversationArea.jsx";
import ChatSubmit from "./ChatSubmit.jsx";
import "./ConversationsLayOut.css";
import { Users } from "../../mocks/mockUser.js";
// import { Messages } from "../../mocks/mockMessages.js";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, markMessagesAsRead } from "../../action/actions.js";
import { formatRelativeTime } from "../../utils/dateUtils";
const { Header, Content, Footer, Sider } = Layout;

function ConversationsLayOut() {
  const messages = useSelector((state) => state.messages.messages);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.myInfo);
  // const [message, setMessage] = useState(Messages);
  const { userId } = useParams();
  const navigate = useNavigate();
  const handleUserSelect = (user) => {
    navigate(`/conversations/${user.id}`);
    dispatch(markMessagesAsRead(user.id, currentUser.id));
  };
  const getLastMessageForUser = (userId) => {
    // Lọc tin nhắn giữa currentUser và userId
    const userMessages = messages.filter(
      (msg) =>
        (msg.senderId === currentUser.id && msg.receiverId === userId) ||
        (msg.senderId === userId && msg.receiverId === currentUser.id),
    );

    if (userMessages.length === 0) return null;

    // Lấy tin nhắn cuối cùng (sort theo createdAt)
    const lastMsg = userMessages.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    )[0];

    return {
      content: lastMsg.content,
      timestamp: formatRelativeTime(lastMsg.createdAt),
    };
  };

  const getUnreadInfo = (userId) => {
    // Lọc tin nhắn CHƯA ĐỌC từ userId gửi cho currentUser
    const unreadMessages = messages.filter(
      (msg) =>
        msg.senderId === userId &&
        msg.receiverId === currentUser.id &&
        msg.isRead === false,
    );

    return {
      hasUnread: unreadMessages.length > 0,
      unreadCount: unreadMessages.length,
    };
  };

  const selectedUserId = userId ? Number(userId) : null;
  const selectedUser = selectedUserId
    ? Users.find((u) => u.id === selectedUserId)
    : null;
  const handleSendMessage = (text, chattingUser) => {
    if (!currentUser || !chattingUser) return;

    const newMessage = {
      id: uuidv4(),
      senderId: currentUser.id,
      receiverId: chattingUser.id,
      content: text,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    // setMessage((prev) => [...prev, newMessage]);
    dispatch(addMessage(newMessage));
    console.log(newMessage);
  };

  return (
    <Layout className="conversations-layout">
      <Sider width={300} className="conversations-sider">
        <SearchBar />
        <UserCardContainer
          Users={Users}
          onUserSelect={handleUserSelect}
          selectedUserId={selectedUserId}
          getLastMessage={getLastMessageForUser}
          getUnreadInfo={getUnreadInfo}
        />
      </Sider>
      {!selectedUserId && (
        <div className="empty">
          <h1>Chưa có cuộc trò chuyện nào</h1>
          <h1>Hãy bắt đầu ngay</h1>
        </div>
      )}
      {selectedUserId && selectedUser && (
        <Layout className="conversations-main">
          <Header className="conversations-header">
            <Avatar
              className="chatting-avatar"
              icon={<UserOutlined />}
              src={selectedUser.avatar}
            />
            <span className="chatting-name">{selectedUser.name}</span>
          </Header>
          <Content className="conversations-content">
            <ConversationArea
              chattingUser={selectedUser}
              newMessages={messages}
            />
          </Content>

          <Footer className="conversations-footer">
            <ChatSubmit
              chattingUser={selectedUser}
              onSend={handleSendMessage}
            />
          </Footer>
        </Layout>
      )}
    </Layout>
  );
}

export default ConversationsLayOut;
