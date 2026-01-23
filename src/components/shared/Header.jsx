import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./Header.css";
import { Dropdown } from "antd";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  return (
    <div className="header-container">
      <img
        src="/mail.svg"
        alt="Logo"
        className="header-logo"
        onClick={() => navigate("/conversations")}
      />
      <span className="header-title">Chat Management</span>
      <Dropdown
        trigger={["click"]}
        menu={{
          items,
          onClick: ({ key }) => {
            if (key === "1") navigate("/profile");
          },
        }}
      >
        <Avatar className="header-avatar" icon={<UserOutlined />} />
      </Dropdown>
    </div>
  );
};

export default Header;
