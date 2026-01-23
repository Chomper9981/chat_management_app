import React from "react";
import UserCard from "./UserCard.jsx";
import "./UserCard.css";

const UserCardContainer = ({Users, onUserSelect, selectedUserId}) => {


  return (
    <div className="user-card-container">
      {Users.map((user) => (
        <UserCard
          key={user.id}
          id={user.id}
          name={user.name}
          avatar={user.avatar}
          isOnline={user.isOnline}
          hasUnread={user.hasUnread}
          lastMessage={user.lastMessage}
          timestamp={user.timestamp}
          unreadCount={user.unreadCount}
          onClick={() => onUserSelect(user)}
          isActive={user.id === selectedUserId}
        />
      ))}
    </div>
  );
};

export default UserCardContainer;