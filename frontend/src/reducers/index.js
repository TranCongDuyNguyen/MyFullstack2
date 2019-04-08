import { combineReducers } from 'redux';

import itemReducer from './itemReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import motorReducer from './motorReducer';

export default combineReducers({
    item: itemReducer,
    error: errorReducer,
    auth: authReducer,
    motor: motorReducer
})