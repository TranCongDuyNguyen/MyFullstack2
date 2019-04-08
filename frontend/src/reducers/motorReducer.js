import {MOTOR_LOADING, GET_MOTOR_DATA} from '../actions/types';

const initialState = {
    motors: [],
    loading: false
};

export default function(state = initialState, action){
    switch(action.type){
        case GET_MOTOR_DATA:
            return {
                ...state,
                motors: action.payload,
                loading: false
            };
        case MOTOR_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}

           