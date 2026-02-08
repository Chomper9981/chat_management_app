import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducer/rootReducer";
import websocketMiddleware from "../middleware/websocketMiddleware";

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(websocketMiddleware),
});

export default store;
