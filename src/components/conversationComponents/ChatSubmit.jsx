import React, { useState } from "react";
import { SendOutlined } from "@ant-design/icons";
import { Input } from "antd";
import "./ChatSubmit.css";

const { TextArea } = Input;

const ChatSubmit = ({
  onSend,
  chattingUser,
  placeholder = "Aa",
  disabled = false,
}) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim() || !chattingUser || disabled) return;

    onSend(message, chattingUser);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-submit">
      <div className="chat-submit-input-wrapper">
        <TextArea
          className="chat-submit-input"
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          autoSize={{ minRows: 1, maxRows: 6 }}
          disabled={disabled}
          bordered={false}
        />
      </div>

      <button
        className="chat-submit-send-btn"
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        type="button"
        aria-label="Send message"
      >
        <SendOutlined />
      </button>
    </div>
  );
};

export default ChatSubmit;
