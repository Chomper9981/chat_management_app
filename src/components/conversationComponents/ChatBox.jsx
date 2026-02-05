import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ChatBox.css";
import { useDispatch } from "react-redux";
import { deleteChatBox, renameChatBox } from "../../action/actions";
import { Dropdown } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

const ChatBox = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { botId, conversationId } = useParams();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(data.boxName);

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

  const triggerRenameInput = () => {
    setIsRenaming(true);
  };

  const handleRename = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (newName.trim()) {
      dispatch(renameChatBox(data.id, newName));
      setIsRenaming(false);
    }
  };

  const handleDelete = (boxId) => {
    dispatch(deleteChatBox(boxId));
    navigate(`/dashboard/chatbot/${botId}/new`);
  };

  return (
    <div
      className={`chatbox-item ${conversationId === data.id ? "chatbox-item-active" : ""}`}
      onClick={() => navigate(`/dashboard/chatbot/${botId}/${data.id}`)}
      style={{
        cursor: "pointer",
        padding: "10px",
        borderBottom: "1px solid #eee",
      }}
    >
      <div className="chatbox-info">
        {isRenaming ? (
          <form onSubmit={handleRename} onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => setIsRenaming(false)}
              autoFocus
              style={{ width: "100%" }}
            />
          </form>
        ) : (
          <div style={{ display: "flex", alignItems: "center" }}>
            <a>{data.boxName}</a>
            {conversationId === data.id && (
              <Dropdown
                trigger={["click"]}
                menu={{
                  items,
                  onClick: ({ key }) => {
                    if (key === "1") {
                      triggerRenameInput(data.id);
                    }
                    if (key === "2") {
                      handleDelete(data.id);
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
