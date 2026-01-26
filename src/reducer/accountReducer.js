import { REGISTER_SUCCESS } from "../action/types";

const savedAccounts = localStorage.getItem("listAccounts");
const initialState = {
  accounts: savedAccounts ? JSON.parse(savedAccounts) : [],
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS: {
      const updatedAccounts = [...state.accounts, action.payload];
      localStorage.setItem("listAccounts", JSON.stringify(updatedAccounts));
      return {
        ...state,
        accounts: updatedAccounts,
      };
    }
    default:
      return state;
  }
};
export default accountReducer;
