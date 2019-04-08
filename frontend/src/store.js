import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import RootReducer from './reducers';
//import { composeWithDevTools } from 'remote-redux-devtools'; --> remove later

const initialState = {};

const middlewares = [thunk];

const store = createStore(RootReducer, initialState, compose(
    applyMiddleware(...middlewares),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

export default store;
