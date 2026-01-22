import MessageList from "./MessageList";
import "./ConversationArea.css";
import { mockMessages, currentUser } from "../mocks/mockMessages";

export default function ConversationArea() {
  return (
    <div className="conversation-area">
      <MessageList
        messages={mockMessages}
        currentUser={currentUser}
      />
    </div>
  );
}
