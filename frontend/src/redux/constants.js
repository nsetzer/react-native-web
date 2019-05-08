export const FETCHING_DATA = 'FETCHING_DATA'
export const FETCHING_DATA_SUCCESS = 'FETCHING_DATA_SUCCESS'
export const FETCHING_DATA_FAILURE = 'FETCHING_DATA_FAILURE'

export const EXAMPLE_ACTION = 'EXAMPLE_ACTION'

export const ROUTE_SET_AUTHENTICATED = 'ROUTE_SET_AUTHENTICATED'
export const ROUTE_INIT_ACTION = 'ROUTE_INIT_ACTION'
export const ROUTE_PUSH_ACTION = 'ROUTE_PUSH_ACTION'

export const MODAL_SHOW = 'MODAL_SHOW'
export const MODAL_HIDE = 'MODAL_HIDE'

export const USER_LOGIN = 'USER_LOGIN'
export const USER_SET_TOKEN = 'USER_SET_TOKEN'
export const USER_CLEAR_TOKEN = 'USER_CLEAR_TOKEN'
export const USER_AUTH_BEGIN = 'USER_AUTH_BEGIN'
export const USER_AUTH_SUCCESS = 'USER_AUTH_SUCCESS'
export const USER_AUTH_FAIL = 'USER_AUTH_FAIL'
export const USER_REGISTER = 'USER_REGISTER'

// notes have two basic actions
// get the list of notes from the server
// for an individual note, get the content on-demand

export const USER_NOTE_FETCH = 'USER_NOTES_FETCH'
export const USER_NOTE_FETCH_SUCCESS = 'USER_NOTE_FETCH_SUCCESS'
export const USER_NOTE_FETCH_ERROR = 'USER_NOTE_FETCH_ERROR'

export const USER_NOTE_REQUEST_CONTENT = 'USER_NOTE_REQUEST_CONTENT'
export const USER_NOTE_SET_CONTENT = 'USER_NOTE_SET_CONTENT'
export const USER_NOTE_CONTENT_ERROR = 'USER_NOTE_CONTENT_ERROR'

export const USER_NOTE_CREATE = 'USER_NOTE_CREATE'

export const USER_NOTE_SAVE = 'USER_NOTE_SAVE'
export const USER_NOTE_SAVE_SUCCESS = 'USER_NOTE_SAVE_SUCCESS'
export const USER_NOTE_SAVE_ERROR = 'USER_NOTE_SAVE_ERROR'

export const USER_NOTE_DELETE = 'USER_NOTE_DELETE'
export const USER_NOTE_DELETE_SUCCESS = 'USER_NOTE_DELETE_SUCCESS'
export const USER_NOTE_DELETE_ERROR = 'USER_NOTE_DELETE_ERROR'

export const USER_STORAGE_FETCH = 'USER_STORAGE_FETCH'
export const USER_STORAGE_FETCH_SUCCESS = 'USER_STORAGE_FETCH_SUCCESS'
export const USER_STORAGE_FETCH_ERROR = 'USER_STORAGE_FETCH_ERROR'

export const AUDIO_LOAD_DOMAIN = 'AUDIO_LOAD_DOMAIN'
export const AUDIO_LOAD_DOMAIN_SUCCESS = 'AUDIO_LOAD_DOMAIN_SUCCESS'
export const AUDIO_LOAD_DOMAIN_ERROR = 'AUDIO_LOAD_DOMAIN_ERROR'
export const AUDIO_CREATE_QUEUE = 'AUDIO_CREATE_QUEUE'
export const AUDIO_POPULATE_QUEUE = 'AUDIO_POPULATE_QUEUE'
export const AUDIO_LOAD_QUEUE = 'AUDIO_LOAD_QUEUE'
export const AUDIO_LOAD_QUEUE_SUCCESS = 'AUDIO_LOAD_QUEUE_SUCCESS'
export const AUDIO_LOAD_QUEUE_ERROR = 'AUDIO_LOAD_QUEUE_ERROR'
export const AUDIO_PLAY_SONG = 'AUDIO_PLAY_SONG'
export const AUDIO_NEXT_SONG = 'AUDIO_NEXT_SONG'
export const AUDIO_PREV_SONG = 'AUDIO_PREV_SONG'