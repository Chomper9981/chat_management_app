import Message from "./Message.jsx";

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
            timestamp={msg.createdAt}
          />
        );
      })}
    </div>
  );
}

export default MessageList;
