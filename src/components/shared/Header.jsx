import { Avatar, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./Header.css";
import { Dropdown } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../action/actions";

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
  const { myInfo, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const handleLogoClick = () => {
  if (isAuthenticated) {
    navigate("/conversations");
  } else {
    navigate("/");
  }
};
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <div className="header-container">
      <img
        src="/mail.svg"
        alt="Logo"
        className="header-logo"
        onClick={handleLogoClick}
      />
      <span className="header-title">Chat Management</span>
      {!isLoginPage && (
        <>
          {!isAuthenticated && (
            <Button type="primary" onClick={() => navigate("/login")}>
              Đăng nhập
            </Button>
          )}

          {isAuthenticated && myInfo && (
            <Dropdown
              trigger={["click"]}
              menu={{
                items,
                onClick: ({ key }) => {
                  if (key === "1") navigate("/profile");
                  if (key === "2") {
                    handleLogout();
                  }
                },
              }}
            >
              <Avatar
                className="header-avatar"
                src={myInfo.avatar}
                icon={<UserOutlined />}
              />
            </Dropdown>
          )}
        </>
      )}
    </div>
  );
};

export default Header;
