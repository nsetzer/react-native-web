

import {
    AUDIO_LOAD_DOMAIN,
    AUDIO_LOAD_DOMAIN_SUCCESS,
    AUDIO_LOAD_DOMAIN_ERROR,
    AUDIO_POPULATE_QUEUE,
    AUDIO_CREATE_QUEUE,
    AUDIO_LOAD_QUEUE,
    AUDIO_LOAD_QUEUE_SUCCESS,
    AUDIO_LOAD_QUEUE_ERROR,
    AUDIO_PLAY_SONG,
    AUDIO_NEXT_SONG,
    AUDIO_PREV_SONG,
} from '../constants'

const INITIAL_STATE = {
    domain: {},
    domain_loading: false,
    domain_loaded: false,
    domain_error: null,
    queue: [],
    queue_loading: false,
    queue_loaded: false,
    queue_error: null,
    queue_id: null,
    queue_index: 0,
}

export default function(state = INITIAL_STATE, action = {}) {
    switch(action.type) {
        case AUDIO_LOAD_DOMAIN:
            return {
                ...state,
                domain_loading: true,
                domain_loaded: false,
                domain_error: null,
            }
        case AUDIO_LOAD_DOMAIN_SUCCESS:
            console.log("domain load success")
            console.log(action.domain)
            return {
                ...state,
                domain: action.domain,
                domain_loading: false,
                domain_loaded: true,
                domain_error: null,
            }
        case AUDIO_LOAD_DOMAIN_ERROR:
            return {
                ...state,
                domain_loading: false,
                domain_loaded: true,
                domain_error: action.status,
            }
        case AUDIO_CREATE_QUEUE:
        case AUDIO_POPULATE_QUEUE:
        case AUDIO_LOAD_QUEUE:
            return {
                ...state,
                queue: [],
                queue_loading: true,
                queue_loaded: false,
                queue_error: null,
            }
        case AUDIO_LOAD_QUEUE_SUCCESS:
            return {
                ...state,
                queue: action.queue,
                queue_loading: false,
                queue_loaded: true,
                queue_id: (new Date()).getTime(),
                queue_index: 0,
                queue_error: null,
            }
        case AUDIO_LOAD_QUEUE_ERROR:
            return {
                ...state,
                queue: [],
                queue_loading: false,
                queue_loaded: true,
                queue_error: action.status,
                queue_index: 0
            }
        case AUDIO_PLAY_SONG:
            return {
                ...state,
                queue_index: action.index
            }
        case AUDIO_NEXT_SONG:
            return {
                ...state,
                queue_index: Math.min(state.queue_index + 1,
                                      state.queue.length - 1)
            }
        case AUDIO_PREV_SONG:
            return {
                ...state,
                queue_index: Math.max(state.queue_index - 1, 0)
            }
        default:
            return state
    }
}