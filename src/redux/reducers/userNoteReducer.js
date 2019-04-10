import {

  USER_NOTE_FETCH_BEGIN,
  USER_NOTE_FETCH_SUCCESS,
  USER_NOTE_FETCH_ERROR,
  USER_NOTE_BEGIN_CONTENT,
  USER_NOTE_SET_CONTENT,
  USER_NOTE_CONTENT_ERROR,
} from '../constants'

function newNote() {
  return {loading: false, loaded: false, error: null, text: ''}
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

  var obj = {}

  switch (action.type) {
    case USER_NOTE_FETCH_BEGIN:
      return {
        ...state,
        loading: true,
        laoded: false,
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
        laoded: false,
        notes: [],
        content: {},
        error: action.status
      }

    //  User has requested the content body of a note
    case USER_NOTE_BEGIN_CONTENT:
      obj[action.uid] = action.content
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
    default:
      return state
  }
}