import {GET_ERRORS, CLEAR_ERRORS} from '../actions/types';

const initialState = {
    msgs: {}, //come from server
    status: null,
    id: null
}

export default function(state = initialState, action) {
    switch(action.type){
        case GET_ERRORS:
            return {
                ...state,
                msgs: action.payload.msg,
                status: action.payload.status,
                id: action.payload.id
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                msgs: {},
                status: null,
                id: null
            }
        default:
            return state;
    }
}