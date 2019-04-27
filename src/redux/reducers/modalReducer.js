
import {
    MODAL_SHOW,
    MODAL_HIDE,
} from '../constants'

const INITIAL_STATE = {
    render: null,
    accept: null,
    reject: null,
}

const default_accept = (result=null) => {}
const default_reject = () => {}

export default function(state = INITIAL_STATE, action = {}) {
    switch(action.type) {
        case MODAL_SHOW:
            console.log("show modal")
            return  {
                render: action.render,
                accept: action.accept || default_accept,
                reject: action.reject || default_reject,
            };
        case MODAL_HIDE:
            return  {
                render: null,
                accept: null,
                reject: null,
            };
        default:
            return state
    }
}