import { CopyOutlined, DislikeOutlined, LikeOutlined } from "@ant-design/icons";
import "./Message.css";
import { message } from "antd";

const Message = ({ type, text, avatar, timestamp }) => {
  return (
    <div className={`message-row ${type}`}>
      {type === "received" && avatar && (
        <img src={avatar} alt="avatar" className="message-avatar" />
      )}

      <div className="message-bubble">
        <p>{text}</p>
        <div className="message-footer">
          <div className="message-actions">
            <span className="message-time">{timestamp}</span>
            {type === "received" && (
              <CopyOutlined
                onClick={() => {
                  navigator.clipboard.writeText(text);
                  message.success(`Đã lưu vào clip board`);
                }}
              />
            )}
          </div>
          {type === "received" && (
            <div className="message-actions">
              <LikeOutlined />
              <DislikeOutlined />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
