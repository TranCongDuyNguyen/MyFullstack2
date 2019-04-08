import {GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEM_LOADING} from '../actions/types';
import axios from 'axios';

import {tokenConfig} from './authAction'; // use token to get private route
import {returnErrors} from './errorAction'; //

//action creator
export const getItems = () => dispatch => {
    dispatch(setItemsLoading());
    axios.get('/api/items')
    .then(res => dispatch({
        type: GET_ITEMS,
        payload: res.data
    }))
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const addItem = newItem => (dispatch, getState) => {
    axios.post('/api/items', newItem, tokenConfig(getState))
    .then(res => dispatch({
        type: ADD_ITEM,
        payload: res.data // render using API data
    }))
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const deleteItem = id => (dispatch, getState) => {
    axios.delete('/api/items/' + id, tokenConfig(getState))
    .then(res => dispatch({
        type: DELETE_ITEM,
        payload: id // render using internal state
    }))
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
}

export const setItemsLoading = () => {
    return {
        type: ITEM_LOADING
    }
}

