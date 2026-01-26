import React from "react";
import UserCard from "./UserCard.jsx";
import "./UserCard.css";

const UserCardContainer = ({
  Users,
  onUserSelect,
  selectedUserId,
  getLastMessage,
  getUnreadInfo,
  showDeleteButton = false,
  onDeleteUser,
}) => {
  return (
    <div className="user-card-container">
      {Users.map((user) => {
        const lastMsg = getLastMessage ? getLastMessage(user.id) : null;
        const unreadInfo = getUnreadInfo
          ? getUnreadInfo(user.id)
          : { hasUnread: false, unreadCount: 0 };
        return (
          <UserCard
            key={user.id}
            id={user.id}
            name={user.name}
            avatar={user.avatar}
            isOnline={true}
            lastMessage={lastMsg?.content || null}
            timestamp={lastMsg?.timestamp || null}
            hasUnread={unreadInfo.hasUnread}
            unreadCount={unreadInfo.unreadCount}
            onClick={() => onUserSelect(user)}
            isActive={user.id === selectedUserId}
            showDeleteButton={showDeleteButton}
            onDelete={() => onDeleteUser?.(user.id)}
          />
        );
      })}
    </div>
  );
};

export default UserCardContainer;
