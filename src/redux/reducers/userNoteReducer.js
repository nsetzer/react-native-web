import {

  USER_NOTE_FETCH,
  USER_NOTE_FETCH_SUCCESS,
  USER_NOTE_FETCH_ERROR,

  USER_NOTE_REQUEST_CONTENT,
  USER_NOTE_SET_CONTENT,
  USER_NOTE_CONTENT_ERROR,

  USER_NOTE_SAVE,
  USER_NOTE_SAVE_SUCCESS,
  USER_NOTE_SAVE_ERROR,

  USER_NOTE_DELETE,
  USER_NOTE_DELETE_SUCCESS,
  USER_NOTE_DELETE_ERROR,

} from '../constants'

function newNote() {
  return {
    loading: false,
    loaded: false,
    error: null,
    saving: false,
    deleting: false,
    text: ''
  }
}

const INITIAL_STATE = {
  // note content is being loaded
  loading: false,
  // note content has been loaded
  loaded: false,
  // error receiving notes
  error: null,

  // note note-identifier to note title
  notes: {},
  // note-identifier to note content
  content: {},
}

export default function userReducer (state = INITIAL_STATE, action) {

  var new_state;
  var obj = {};

  switch (action.type) {
    case USER_NOTE_FETCH:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
        notes: {},
        content: {}
      }

    // A user requested the list of notes
    // the request completed successfully
    case USER_NOTE_FETCH_SUCCESS:
      var content = Object.keys(action.notes).reduce(
          (obj, x) => Object.assign(obj, { [x]: newNote() }), {}
      )
      return {
        ...state,
        loading: false,
        loaded: true,
        error: null,
        notes: action.notes,
        content: content
      }
    // A user requested the list of notes
    // the request failed to complete for some reason
    case USER_NOTE_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        loaded: false,
        notes: [],
        content: {},
        error: action.status
      }

    //  User has requested the content body of a note
    case USER_NOTE_REQUEST_CONTENT:
      obj[action.uid] = {loading: true, loaded: false, error: null, text: ''}
      return {
        ...state,
        content: {...state.content, ...obj}
      }
    //  the request completed successfully
    case USER_NOTE_SET_CONTENT:
      obj[action.uid] = action.content
      return {
        ...state,
        content: {...state.content, ...obj}
      }
    //  the request failed successfully
    case USER_NOTE_CONTENT_ERROR:
      obj[action.uid] = action.content
      return {
        ...state,
        content: {...state.content, ...obj}
      }

    case USER_NOTE_SAVE:
      obj = {...state.content}
      obj[action.uid] = {...obj[action.uid], saving: true}
      return {
        ...state,
        content: obj
      }
    case USER_NOTE_SAVE_SUCCESS:
      //TODO: changing the Title of a note has not been implemented
      // saving is complicated
      // a rename needs to remove the content under the old name
      // and re add the content under the new name
      obj = {...state.content}
      obj[action.uid] = {...obj[action.uid], saving: false, text:action.text}
      return {
        ...state,
        content: obj
      }
    case USER_NOTE_DELETE:
      obj = {...state.content}
      obj[action.uid] = {...obj[action.uid], deleting: true}
      return {
        ...state,
        content: obj
      }
    case USER_NOTE_DELETE_SUCCESS:
      new_state = {...state}

      obj = {...state.content}
      delete obj[action.uid]
      new_state.content = obj

      obj = {...state.notes}
      delete obj[action.uid]
      new_state.notes = obj

      return new_state

    default:
      return state
  }
}