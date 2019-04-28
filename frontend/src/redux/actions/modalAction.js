

import {
    MODAL_SHOW,
    MODAL_HIDE,
} from '../constants'

export function modalShow(render, accept=null, reject=null) {
    return {
        type: MODAL_SHOW,
        render,
        accept,
        reject
    }
}

export function modalHide() {
    return {
        type: MODAL_SHOW,
    }
}