
import { Platform } from 'react-native';

import {
    ROUTE_SET_AUTHENTICATED,
    ROUTE_INIT_ACTION,
    ROUTE_PUSH_ACTION
} from '../constants'


const INITIAL_STATE = {
    'location': '/',
    'authenticated': false
}

export default function(state = INITIAL_STATE, action = {}) {
    switch(action.type) {
        case ROUTE_SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: action.payload,
              }
        case ROUTE_INIT_ACTION:
            console.log("init:" + action.payload);
            return {
                ...state,
                location: action.payload,
            }
        case ROUTE_PUSH_ACTION:

            if (Platform.OS === 'web') {
                window.history.pushState(null, '', action.payload);
            }
            console.log("push:" + action.payload);
            return {
                ...state,
                location: action.payload,
          }
        default:
            return state
    }
}