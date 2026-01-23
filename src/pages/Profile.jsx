import React from 'react';
import { Card, Descriptions, Button, Avatar, Space } from 'antd';
import { UserOutlined, MailOutlined, IdcardOutlined, LogoutOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../action/actions';
import Header from '../components/shared/Header.jsx';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Lấy myInfo từ Redux store
  const { myInfo, isAuthenticated } = useSelector((state) => state.auth);

  // Xử lý logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Xử lý quay lại trang conversations
  const handleBack = () => {
    navigate('/conversations');
  };

  // Nếu chưa đăng nhập, hiển thị thông báo
  if (!isAuthenticated || !myInfo) {
    return (
      <div>
        <Header />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 'calc(100vh - 64px)',
          padding: '20px'
        }}>
          <Card>
            <p>Bạn chưa đăng nhập. Vui lòng đăng nhập để xem thông tin.</p>
            <Button type="primary" onClick={() => navigate('/login')}>
              Đăng nhập
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 64px)',
        padding: '20px',
        background: '#f0f2f5'
      }}>
        <Card
          style={{ 
            width: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar size={48} icon={<UserOutlined />} />
              <span>Thông tin cá nhân</span>
            </div>
          }
          extra={
            <Space>
              <Button 
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
              >
                Quay lại
              </Button>
              <Button 
                danger 
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </Space>
          }
        >
          <Descriptions bordered column={1} labelStyle={{ fontWeight: 'bold', width: '150px' }}>
            <Descriptions.Item 
              label={
                <span>
                  <IdcardOutlined style={{ marginRight: '8px' }} />
                  ID
                </span>
              }
            >
              {myInfo.id}
            </Descriptions.Item>

            <Descriptions.Item 
              label={
                <span>
                  <UserOutlined style={{ marginRight: '8px' }} />
                  Họ và tên
                </span>
              }
            >
              {myInfo.name}
            </Descriptions.Item>

            <Descriptions.Item 
              label={
                <span>
                  <UserOutlined style={{ marginRight: '8px' }} />
                  Tên đăng nhập
                </span>
              }
            >
              {myInfo.username}
            </Descriptions.Item>

            <Descriptions.Item 
              label={
                <span>
                  <MailOutlined style={{ marginRight: '8px' }} />
                  Email
                </span>
              }
            >
              {myInfo.gmail}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: '24px', padding: '16px', background: '#fafafa', borderRadius: '4px' }}>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              💡 <strong>Lưu ý:</strong> Thông tin này được lưu trong Redux store và localStorage. 
              Dữ liệu sẽ được giữ nguyên ngay cả khi bạn refresh trang.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;