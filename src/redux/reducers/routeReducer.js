
import { Platform } from 'react-native';

import {
    ROUTE_SET_AUTHENTICATED,
    ROUTE_INIT_ACTION,
    ROUTE_PUSH_ACTION
} from '../constants'


const INITIAL_STATE = {
    'initialized': false,
    'location': '/',
    'authenticated': false,
    history: []
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
                initialized: true,
                location: action.payload,
            }
        case ROUTE_PUSH_ACTION:

            if (Platform.OS === 'web') {
                window.history.pushState(null, '', action.payload);
            } else {
                // PUSH
                // [action.payload].concat(state.history).slice(0, MAX_LENGTH)
                // POP
                // state.history.slice(1, MAX_LENGTH)
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