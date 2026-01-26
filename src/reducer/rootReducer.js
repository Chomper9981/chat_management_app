import { combineReducers } from "redux";

import loginReducer from "./loginReducer";
import messageReducer from "./messageReducer";

const rootReducer = combineReducers({
  auth: loginReducer,
  messages: messageReducer,
});

export default rootReducer;
