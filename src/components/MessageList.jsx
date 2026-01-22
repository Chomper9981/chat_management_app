import Message from "./Message";
import "./MessageList.css";

export default function MessageList({ messages, currentUser }) {
  return (
    <div className="message-list">
      {messages.map((msg, index) => {
        const prevMsg = messages[index - 1];
        const nextMsg = messages[index + 1];

        const isSameSenderAsPrev =
          prevMsg && prevMsg.senderId === msg.senderId;
        const isSameSenderAsNext =
          nextMsg && nextMsg.senderId === msg.senderId;

        const isGroupStart = !isSameSenderAsPrev;
        const isGroupEnd = !isSameSenderAsNext;

        return (
          <Message
            key={msg.id}
            {...msg}
            type={msg.senderId === currentUser.id ? "sent" : "received"}
            isGroupStart={isGroupStart}
            isGroupEnd={isGroupEnd}
            showAvatar={isGroupEnd}
          />
        );
      })}
    </div>
  );
}
