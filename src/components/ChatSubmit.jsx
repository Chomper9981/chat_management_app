import React, { useState } from 'react';
import { SendOutlined, SmileOutlined, PaperClipOutlined, PictureOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import './ChatSubmit.css';

const { TextArea } = Input;

const ChatSubmit = ({ onSend, placeholder = "Aa" }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend?.(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    // Send message on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachment = () => {
    console.log('Open attachment picker');
  };

  const handleImage = () => {
    console.log('Open image picker');
  };

  const handleEmoji = () => {
    console.log('Open emoji picker');
  };

  return (
    <div className="chat-submit">
      {/* Left icons - Attachments */}
      <div className="chat-submit-actions">
        <button 
          className="chat-submit-icon-btn"
          onClick={handleAttachment}
          aria-label="Attach file"
        >
          <PaperClipOutlined />
        </button>
        <button 
          className="chat-submit-icon-btn"
          onClick={handleImage}
          aria-label="Attach image"
        >
          <PictureOutlined />
        </button>
      </div>

      {/* Input area */}
      <div className="chat-submit-input-wrapper">
        <TextArea
          className="chat-submit-input"
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          autoSize={{ minRows: 1, maxRows: 4 }}
        //   bordered={false}
        />
      </div>

      {/* Right icons - Emoji and Send */}
      <div className="chat-submit-actions">
        <button 
          className="chat-submit-icon-btn"
          onClick={handleEmoji}
          aria-label="Add emoji"
        >
          <SmileOutlined />
        </button>
        <button 
          className={`chat-submit-send-btn ${message.trim() ? 'active' : ''}`}
          onClick={handleSend}
          disabled={!message.trim()}
          aria-label="Send message"
          type = 'submit'
        >
          <SendOutlined />
        </button>
      </div>
    </div>
  );
};

export default ChatSubmit;