import { Avatar, Badge } from "antd";
import { UserOutlined } from "@ant-design/icons";
import './UserCard.css';

const UserCard = ({ 
  avatar,
  name = "Người dùng",
  isOnline = false,
  hasUnread = false,
  lastMessage,
  timestamp,
  unreadCount = 0
}) => {
  return (
    <div className="user-card">
      <Badge 
        dot 
        status={isOnline ? "success" : "default"}
        offset={[-4, 26]}
        className="user-card-badge"
      >
        <Avatar 
          className="user-card-avatar" 
          icon={<UserOutlined />}
          src={avatar}
        />
      </Badge>
      
      <div className="user-card-content">
        <div className="user-card-header">
          <span className={`user-card-name ${hasUnread ? 'unread' : ''}`}>
            {name}
          </span>
          {timestamp && (
            <span className="user-card-timestamp">{timestamp}</span>
          )}
        </div>
        
        {lastMessage && (
          <div className="user-card-preview">
            <span className={`last-message ${hasUnread ? 'unread' : ''}`}>
              {lastMessage}
            </span>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;