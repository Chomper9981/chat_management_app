import './Message.css'

function Message({ type, text, avatar, timestamp }) {
  return (
    <div className={`message-row ${type}`}>
      {type === "received" && avatar && (
        <img src={avatar} alt="avatar" className="message-avatar" />
      )}

      <div className="message-bubble">
        <p>{text}</p>
        <span className="message-time">{timestamp}</span>
      </div>
    </div>
  );
}

export default Message;
