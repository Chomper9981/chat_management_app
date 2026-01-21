import { Layout, Menu } from "antd";
import SearchBar from "./SearchBar.jsx";
import "./ConversationsLayOut.css";
import { Avatar } from "antd";
import { UserOutlined } from '@ant-design/icons';
import UserCard from "./UserCard.jsx";
import ChatSubmit from "./ChatSubmit.jsx";

const { Header, Content, Footer, Sider } = Layout;

function ConversationsLayOut() {
  return (
    <Layout className="conversations-layout">
      <Sider width={300} collapsedWidth={50} breakpoint="xs" className="conversations-sider">
        <SearchBar />
        <UserCard />
      </Sider>
      <Layout className="conversations-main">
        <Header className="conversations-header">
          <Avatar className="chatting-avatar" icon={<UserOutlined />} />
          <span className="chatting-name">Đối tượng đang chat</span>
        </Header>
        <Content className="conversations-content">Nội dung chính</Content>
        
        <Footer className="conversations-footer">
          <ChatSubmit />
        </Footer>
      </Layout>
    </Layout>
  );
}

export default ConversationsLayOut;
