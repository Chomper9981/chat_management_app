import React from 'react';
import Header from '../components/shared/Header.jsx';
import ConversationsLayOut from '../components/conversationComponents/ConversationsLayOut.jsx';
import './Conversations.css';

const Conversations = () => {
  return (
    <div className="conversations-page">
      <div className="conversations-page-header">
        <Header />
      </div>
      <div className="conversations-page-content">
        <ConversationsLayOut />
      </div>
    </div>
  );
};

export default Conversations;