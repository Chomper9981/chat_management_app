import { combineReducers } from "redux";

import loginReducer from "./loginReducer";
import messageReducer from "./messageReducer";
import accountReducer from "./accountReducer";
import conversationReducer from "./conversationReducer";
import botReducer from "./botReducer";
import chatboxReducer from "./chatboxReducer";
import chatReducer from "./chatReducer";
import iframeBoxReducer from "./iframeBoxReducer";

const rootReducer = combineReducers({
  auth: loginReducer,
  messages: messageReducer,
  account: accountReducer,
  conversations: conversationReducer,
  bot: botReducer,
  chatBox: chatboxReducer,
  chat: chatReducer,
  iframeBox: iframeBoxReducer,
});

export default rootReducer;
