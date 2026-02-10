import React from "react";
import ChatBox from "./ChatBox";
import "./ChatBoxContainer.css";

const ChatBoxContainer = ({
  chatBoxes,
  activeConversationId,
  renamingId,
  renameValue,
  onSelect,
  onStartRename,
  onRenameChange,
  onRenameSubmit,
  onRenameBlur,
  onDelete,
  isBotTyping,
}) => {
  
  return (
    <div className="chatbox-container">
      {chatBoxes.map((box) => (
        <ChatBox
          key={box.id}
          data={box}
          isActive={activeConversationId === box.id}
          isRenaming={renamingId === box.id}
          renameValue={renameValue}
          onSelect={onSelect}
          onStartRename={onStartRename}
          onRenameChange={onRenameChange}
          onRenameSubmit={onRenameSubmit}
          onRenameBlur={onRenameBlur}
          onDelete={onDelete}
          isBotTyping={isBotTyping}
        />
      ))}
    </div>
  );
};

export default ChatBoxContainer;