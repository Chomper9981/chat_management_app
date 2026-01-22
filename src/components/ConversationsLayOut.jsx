import { useState } from "react";
import { Layout, Button, Avatar } from "antd";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import SearchBar from "./SearchBar.jsx";
import UserCardContainer from "./UserCardContainer.jsx";
import ConversationArea from "./ConversationArea.jsx";
import ChatSubmit from "./ChatSubmit.jsx";
import "./ConversationsLayOut.css";
import { Users } from "../mocks/mockUser";

const { Header, Content, Footer, Sider } = Layout;

function ConversationsLayOut() {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <Layout className="conversations-layout">
      <Sider width={300} className="conversations-sider">
        <SearchBar />
        <UserCardContainer
          Users={Users}
          onUserSelect={handleUserSelect}
          selectedUserId={selectedUser?.id}
        />
      </Sider>
      {selectedUser != null && (
        <Layout className="conversations-main">
          <Header className="conversations-header">
            <Avatar
              className="chatting-avatar"
              icon={<UserOutlined />}
              src={selectedUser?.avatar}
            />
            <span className="chatting-name">
              {selectedUser?.name || "Chọn cuộc trò chuyện"}
            </span>
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
