import "./Message.css";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

export default function Message({
  type,
  text,
  avatar,
  timestamp,
  status,
  isGroupStart,
  isGroupEnd,
  showAvatar,
}) {
  return (
    <div className={`message-row ${type}`}>
      {type === "received" && showAvatar && (
        <Avatar className="chatting-avatar" icon={<UserOutlined />} src={avatar} />
      )}

      <div className="message-wrapper">
        <div
          className={`
            message-bubble
            ${type}
            ${isGroupStart ? "group-start" : ""}
            ${isGroupEnd ? "group-end" : ""}
          `}
        >
          <span className="message-text">{text}</span>
        </div>

        {isGroupEnd && (
          <div className="message-meta">
            <span className="timestamp">{timestamp}</span>
            {type === "sent" && (
              <span className={`status ${status}`}>{status}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
