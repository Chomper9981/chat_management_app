import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./Header.css";

const Header = () => {
  return (
    <div className="header-container">
      <img src="/mail.svg" alt="Logo" className="header-logo" />
      <span className="header-title">Chat Management</span>
      <Avatar className="header-avatar" icon={<UserOutlined />} />
    </div>
  );
};

export default Header;
