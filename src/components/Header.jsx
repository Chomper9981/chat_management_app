import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./Header.css";
import { Dropdown } from "antd";

const items = [
  {
    key: "1",
    label: "Trang cá nhân",
  },
  {
    key: "2",
    label: "Đăng xuất",
  },
];

const Header = () => {
  return (
    <div className="header-container">
      <img src="/mail.svg" alt="Logo" className="header-logo" />
      <span className="header-title">Chat Management</span>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Avatar className="header-avatar" icon={<UserOutlined />} />
      </Dropdown>
    </div>
  );
};

export default Header;
