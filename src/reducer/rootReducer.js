import { combineReducers } from "redux";

import loginReducer from "./loginReducer";
import messageReducer from "./messageReducer";
import accountReducer from "./accountReducer";
import conversationReducer from "./conversationReducer";
import botReducer from "./botReducer";
import chatboxReducer from "./chatboxReducer";
import chatReducer from "./chatReducer";
import iframeBoxReducer from "./iframeBoxReducer";
import streamChatReducer from "./streamChatReducer";

const rootReducer = combineReducers({
  auth: loginReducer,
  messages: messageReducer,
  account: accountReducer,
  conversations: conversationReducer,
  bot: botReducer,
  chatBox: chatboxReducer,
  chat: chatReducer,
  iframeBox: iframeBoxReducer,
  streamChat: streamChatReducer,
});

export default rootReducer;
