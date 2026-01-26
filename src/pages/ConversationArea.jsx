import { useSelector } from "react-redux";
import MessageList from "../components/messageComponents/MessageList.jsx";

const ConversationArea = ({ chattingUser, newMessages = [] }) => {
  const currentUser = useSelector((state) => state.auth.myInfo);

  if (!currentUser || !chattingUser) {
    return null;
  }
  const conversationMessages = newMessages.filter(
    (msg) =>
      (msg.senderId === currentUser.id &&
        msg.receiverId === chattingUser.id) ||
      (msg.senderId === chattingUser.id &&
        msg.receiverId === currentUser.id)
  );

  
  return (
    <MessageList
      messages={conversationMessages}
      currentUser={currentUser}
      chattingUser={chattingUser}
    />
  );
}

export default ConversationArea;
