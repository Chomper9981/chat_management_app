import { useSelector } from "react-redux";
import MessageList from "../components/messageComponents/MessageList.jsx";

const ConversationArea = ({ chattingUser, newMessages = [], items }) => {
  const currentUser = useSelector((state) => state.auth.myInfo);
  const currentUserId = currentUser?.id || "user";

  if (!chattingUser) {
    return null;
  }
  const conversationMessages = newMessages.filter(
    (msg) =>
      (msg.senderId === currentUserId &&
        msg.receiverId === chattingUser.id) ||
      (msg.senderId === chattingUser.id &&
        msg.receiverId === currentUserId)
  );

  
  return (
    <MessageList
      messages={conversationMessages}
      currentUser={currentUser}
      chattingUser={chattingUser}
      items = {items}
    />
  );
}

export default ConversationArea;
