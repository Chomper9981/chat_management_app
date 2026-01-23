import { Layout, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import UserCardContainer from "./UserCardContainer.jsx";
import ConversationArea from "../../pages/ConversationArea.jsx";
import ChatSubmit from "./ChatSubmit.jsx";
import "./ConversationsLayOut.css";
import { Users } from "../../mocks/mockUser.js";

const { Header, Content, Footer, Sider } = Layout;

function ConversationsLayOut() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const handleUserSelect = (user) => {
    navigate(`/conversations/${user.id}`);
  };
  const selectedUserId = userId ? Number(userId) : null;
  const selectedUser = selectedUserId
    ? Users.find((u) => u.id === selectedUserId)
    : null;
  return (
    <Layout className="conversations-layout">
      <Sider width={300} className="conversations-sider">
        <SearchBar />
        <UserCardContainer
          Users={Users}
          onUserSelect={handleUserSelect}
          selectedUserId={selectedUserId}
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
            <ConversationArea />
          </Content>

          <Footer className="conversations-footer">
            <ChatSubmit />
          </Footer>
        </Layout>
      )}
    </Layout>
  );
}

export default ConversationsLayOut;
