import {MOTOR_LOADING, GET_MOTOR_DATA} from '../actions/types';
import axios from 'axios';

import {tokenConfig} from './authAction'; // use token to get private route
import {returnErrors} from './errorAction'; //

export const getMotor = () => dispatch => {
    dispatch(getMotorLoading());
    axios.get('/api/motors')
    .then(res => dispatch({
        type: GET_MOTOR_DATA,
        payload: res.data
    }))
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const getMotorLoading = () => {
    return {
        type: MOTOR_LOADING
    };
};