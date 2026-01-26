import {
  addMessage,
  markMessagesAsRead,
  addConversation,
  removeConversation,
} from "../../action/actions.js";
import { Layout, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { formatRelativeTime } from "../../utils/dateUtils";
import SearchBar from "./SearchBar.jsx";
import UserCardContainer from "./UserCardContainer.jsx";
import ConversationArea from "../../pages/ConversationArea.jsx";
import ChatSubmit from "./ChatSubmit.jsx";
import "./ConversationsLayOut.css";

const { Header, Content, Footer, Sider } = Layout;

const ConversationsLayOut = () => {
  const messages = useSelector((state) => state.messages.messages);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.myInfo);
  const accounts = useSelector((state) => state.account.accounts);
  const { userId } = useParams();
  const navigate = useNavigate();
  const conversationIds = useSelector(
    (state) => state.conversations.conversationIds,
  );
  const [searchQuery, setSearchQuery] = useState("");
  // Lọc accounts theo searchQuery
  const searchResults = searchQuery.trim()
    ? accounts.filter((account) =>
        account.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  // Danh sách cuộc trò chuyện đã lưu
  const savedConversations = accounts.filter((account) =>
    conversationIds.includes(account.id),
  );

  // Quyết định hiển thị gì: nếu đang search thì hiện kết quả search, không thì hiện saved
  const displayUsers = searchQuery.trim() ? searchResults : savedConversations;
  const handleUserSelect = (user) => {
    navigate(`/conversations/${user.id}`);
    dispatch(markMessagesAsRead(user.id, currentUser.id));
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleUserSelectFromSearch = (user) => {
    // Thêm vào danh sách conversations
    dispatch(addConversation(user.id));

    // Clear search
    setSearchQuery("");

    // Navigate đến cuộc trò chuyện
    navigate(`/conversations/${user.id}`);
    dispatch(markMessagesAsRead(user.id, currentUser.id));
  };

  const handleDeleteConversation = (userId) => {
    dispatch(removeConversation(userId));

    // Nếu đang xem cuộc trò chuyện này thì navigate về trang chính
    if (selectedUserId === userId) {
      navigate("/conversations");
    }
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

  const selectedUserId = userId ? userId : null;
  const selectedUser = selectedUserId
    ? accounts.find((u) => u.id === selectedUserId)
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
    dispatch(addMessage(newMessage));
    console.log(newMessage);
  };

  return (
    <Layout className="conversations-layout">
      <Sider width={300} className="conversations-sider">
        <SearchBar
          onSearch={handleSearchChange}
          placeholder="Tìm kiếm người dùng..."
        />
        <UserCardContainer
          Users={displayUsers}
          onUserSelect={
            searchQuery.trim() ? handleUserSelectFromSearch : handleUserSelect
          }
          selectedUserId={selectedUserId}
          getLastMessage={getLastMessageForUser}
          getUnreadInfo={getUnreadInfo}
          showDeleteButton={!searchQuery.trim()}
          onDeleteUser={handleDeleteConversation}
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
};

export default ConversationsLayOut;
