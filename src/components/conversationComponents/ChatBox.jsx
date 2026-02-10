import React from "react";
import "./ChatBox.css";
import { Dropdown } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

const ChatBox = ({
  data,
  isActive,
  isRenaming,
  renameValue,
  onSelect,
  onStartRename,
  onRenameChange,
  onRenameSubmit,
  onRenameBlur,
  onDelete,
  isBotTyping,
}) => {
  const items = [
    {
      key: "1",
      label: "Đổi tên",
    },
    {
      key: "2",
      label: "Xóa",
    },
  ];

  

  return (
    <div
      className={`chatbox-item ${isActive ? "chatbox-item-active" : ""}`}
      onClick={() => onSelect(data.id)}
      style={{
        cursor: "pointer",
        padding: "10px",
        borderBottom: "1px solid #eee",
      }}
    >
      <div className="chatbox-info">
        {isRenaming ? (
          <form
            onSubmit={(e) => onRenameSubmit(e, data.id)}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              value={renameValue}
              onChange={(e) => onRenameChange(e.target.value)}
              onBlur={onRenameBlur}
              autoFocus
              style={{ width: "100%" }}
            />
          </form>
        ) : (
          <div style={{ display: "flex", alignItems: "center" }}>
            <a>{data.boxName}</a>
            {isActive && !isBotTyping && (
              <Dropdown
                trigger={["click"]}
                menu={{
                  items,
                  onClick: ({ key }) => {
                    if (key === "1") {
                      onStartRename(data);
                    }
                    if (key === "2") {
                      onDelete(data.id);
                    }
                  },
                }}
              >
                <EllipsisOutlined
                  onClick={(e) => e.stopPropagation()}
                  className="message-options-icon"
                />
              </Dropdown>
            )}
          </div>
        )}
        <small>{new Date(data.timestamp).toLocaleTimeString()}</small>
      </div>
    </div>
  );
};

export default ChatBox;
