import React from "react";
import ChatBox from "./ChatBox";
import "./ChatBoxContainer.css";

const ChatBoxContainer = ({ chatBoxes }) => {
  return (
    <div className="chatbox-container">
      {chatBoxes.map((box) => (
        <ChatBox key={box.id} data={box} />
      ))}
    </div>
  );
};

export default ChatBoxContainer;
