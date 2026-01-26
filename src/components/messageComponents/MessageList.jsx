import Message from "./Message.jsx";
import { formatMessageTime } from '../../utils/dateUtils';

function MessageList({ messages, currentUser, chattingUser }) {
  return (
    <div className="message-list">
      {messages.map((msg) => {
        const isSent = msg.senderId === currentUser.id;

        return (
          <Message
            key={msg.id}
            type={isSent ? "sent" : "received"}
            text={msg.content}
            avatar={!isSent ? chattingUser.avatar : null}
            timestamp={formatMessageTime(msg.createdAt)}
          />
        );
      })}
    </div>
  );
}

export default MessageList;
