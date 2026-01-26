// import { ADD_MESSAGE, MARK_MESSAGES_AS_READ } from "../action/types";

// const initialState = {
//   messages: [], 
// };

// // Load từ localStorage
// const savedMessages = localStorage.getItem("messages");
// if (savedMessages) {
//   try {
//     initialState.messages = JSON.parse(savedMessages);
//   } catch (error) {
//     console.error("Error parsing messages:", error);
//   }
// }

// const messageReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case ADD_MESSAGE:
//       const newMessages = [...state.messages, action.payload];
//       localStorage.setItem("messages", JSON.stringify(newMessages));
//       return {
//         ...state,
//         messages: newMessages,
//       };

//     case MARK_MESSAGES_AS_READ:
//       const { userId, currentUserId } = action.payload;
//       const updatedMessages = state.messages.map((msg) => {
//         if (
//           msg.senderId === userId &&
//           msg.receiverId === currentUserId &&
//           !msg.isRead
//         ) {
//           return { ...msg, isRead: true };
//         }
//         return msg;
//       });
//       localStorage.setItem("messages", JSON.stringify(updatedMessages));
//       return {
//         ...state,
//         messages: updatedMessages,
//       };

//     default:
//       return state;
//   }
// };

// export default messageReducer;
