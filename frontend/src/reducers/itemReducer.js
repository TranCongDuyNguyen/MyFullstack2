
import {GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEM_LOADING} from '../actions/types';

const initialState = {
    items: [],
    loading: false //you can make spining load with this property
};

export default function(state = initialState, action){
    switch(action.type){
        case GET_ITEMS:
            return {
                ...state,
                items: action.payload,
                loading: false
            };
            
        case ADD_ITEM:
            return {
                ...state,
                items: state.items.concat(action.payload)    
            };

        case DELETE_ITEM:
            return {
                ...state,
                items: state.items.filter(item => item._id !== action.payload)
                // should notice "_id" 
            }

        case ITEM_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}

