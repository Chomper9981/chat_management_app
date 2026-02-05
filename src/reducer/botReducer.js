import {CREATE_BOT, DELETE_BOT, UPDATE_BOT} from "../action/types";
import Data from "../components/dashboardComponents/mocks/mockData.js";

const initialState = {
    bots: Data
};

const botReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_BOT:
            return {
                ...state,
                bots: [...state.bots, action.payload],
            };
        case DELETE_BOT:
            return {
                ...state,
                bots: state.bots.filter(bot => bot.id !== action.payload),
            };
        case UPDATE_BOT:
            return {
                ...state,
                bots: state.bots.map(bot => 
                    bot.id === action.payload.id ? action.payload : bot
                ),
            };
        default:
            return state;
    }
};

export default botReducer;