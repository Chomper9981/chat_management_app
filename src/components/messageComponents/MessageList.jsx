import Message from "./Message.jsx";
import { formatMessageTime } from "../../utils/dateUtils";
import { Dropdown } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { deleteMessage } from "../../action/actions.js";
import './MessageList.css';



const MessageList = ({ messages, currentUser, chattingUser, items }) => {
  const dispatch = useDispatch();

  const handleDelete = (msg) => {
    dispatch(deleteMessage(msg.id));
  };

  return (
    <div className="message-list">
      {messages.map((msg) => {
        const isSent = msg.senderId === currentUser.id;

        
        if (!isSent) {
          return (
            <Message
              key={msg.id}
              type="received"
              text={msg.content}
              avatar={chattingUser.avatar}
              timestamp={formatMessageTime(msg.createdAt)}
            />
          );
        }

        
        return (
          <div key={msg.id} className="message-wrapper">
            <Message
              type="sent"
              text={msg.content}
              avatar={null}
              timestamp={formatMessageTime(msg.createdAt)}
              
            />
            {items && (<Dropdown
              trigger={["click"]}
              menu={{
                items,
                onClick: ({ key }) => {
                  if (key === "1") {
                    handleDelete(msg);
                  }
                },
              }}
            >
              <EllipsisOutlined 
                className="message-options-icon"
                
              />
            </Dropdown>)}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
