

import { ROUTE_INIT_ACTION, ROUTE_PUSH_ACTION } from '../constants'


const INITIAL_STATE = {
    'location': ''
}

export default function(state = INITIAL_STATE, action = {}) {
    switch(action.type) {
        case ROUTE_INIT_ACTION:
            console.log("init:" + action.payload);
            return {
            ...state,
            location: action.payload,
          }
        case ROUTE_PUSH_ACTION:
            console.log("push:" + action.payload);
            return {
            ...state,
            location: action.payload,
          }
        default:
            return state
    }
}