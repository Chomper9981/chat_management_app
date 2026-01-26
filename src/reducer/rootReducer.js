import { combineReducers } from "redux";

import loginReducer from "./loginReducer";
import messageReducer from "./messageReducer";
import accountReducer from "./accountReducer";
import conversationReducer from "./conversationReducer";

const rootReducer = combineReducers({
  auth: loginReducer,
  messages: messageReducer,
  account: accountReducer,
  conversations: conversationReducer,
});

export default rootReducer;
