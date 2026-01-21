import React from 'react';
import Header from '../components/Header.jsx';
import ConversationsLayOut from '../components/ConversationsLayOut.jsx';
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