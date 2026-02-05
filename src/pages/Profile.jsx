import React from "react";
import { Card, Descriptions, Button, Avatar, Space } from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  LogoutOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../action/actions.js";
import Header from "../components/shared/Header.jsx";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy myInfo từ Redux store
  const { myInfo, isAuthenticated } = useSelector((state) => state.auth);

  // Xử lý logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Xử lý quay lại trang conversations
  const handleBack = () => {
    navigate("/conversations");
  };

  // Nếu chưa đăng nhập, hiển thị thông báo
  if (!isAuthenticated || !myInfo) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-not-authenticated">
          <Card>
            <p>Bạn chưa đăng nhập. Vui lòng đăng nhập để xem thông tin.</p>
            <Button type="primary" onClick={() => navigate("/login")}>
              Đăng nhập
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <Card
          className="profile-card"
          title={
            <div className="profile-card-title">
              <Avatar size={48} icon={<UserOutlined />} src={myInfo.avatar} />
              <span>Thông tin cá nhân</span>
            </div>
          }
          extra={
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại
              </Button>
              <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
                Đăng xuất
              </Button>
            </Space>
          }
        >
          <Descriptions
            bordered
            column={1}
            styleslabel={{ fontWeight: "bold", width: "150px" }}
          >
            <Descriptions.Item
              label={
                <span>
                  <IdcardOutlined className="profile-icon" />
                  ID
                </span>
              }
            >
              {myInfo.id}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span>
                  <UserOutlined className="profile-icon" />
                  Họ và tên
                </span>
              }
            >
              {myInfo.name}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span>
                  <UserOutlined className="profile-icon" />
                  Tên đăng nhập
                </span>
              }
            >
              {myInfo.username}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span>
                  <MailOutlined className="profile-icon" />
                  Email
                </span>
              }
            >
              {myInfo.gmail}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
