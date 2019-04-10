import { USER_NOTE_FETCH_UPDATE, USER_NOTE_FETCH, USER_NOTE_SET_SUMMARY } from '../constants'

const INITIAL_STATE = {
  // note-identifier to note title
  notes: {
      'note000': 'Grocery List',
      'note001': 'Favorite Color List',
      'note002': 'Favorite Animal List',
      'note003': 'Video Games List',
      'note004': 'TODO',
      'note005': 'Chapter1',
      'note006': 'TestNote1',
      'note007': 'TestNote2',
      'note008': 'TestNote3',
      'note009': 'TestNote4',
      'note010': 'TestNote5',
  },
  // note-identifier to note content
  content: {
    'note000': {loading: false, loaded: true, text: '1. eggs\n2. milk\n3. bread'},
    'note001': {loading: false, loaded: true, text: '1. red\n2. blue\n3. green\n4.yellow\n5.purple'},
    'note002': {loading: false, loaded: true, text: '1. dog\n2. cat\n3. parrot'},
    'note003': {loading: false, loaded: true, text: '1. Zelda\n2. Mario\n3. Yoshi'},
    'note004': {loading: false, loaded: true, text: 'do the laundry\nfile taxes'},
    'note005': {loading: false, loaded: true, text: 'it was the best of times it was the blurst of times'},
    'note006': {loading: false, loaded: true, text: 'line0\nline1\nline2\nline3\nline4\n'},
    'note007': {loading: false, loaded: true, text: 'line0\nline1\nline2\nline3\nline4\n'},
    'note008': {loading: false, loaded: true, text: 'line0\nline1\nline2\nline3\nline4\n'},
    'note009': {loading: false, loaded: true, text: 'line0\nline1\nline2\nline3\nline4\n'},
    'note010': {loading: false, loaded: true, text: 'line0\nline1\nline2\nline3\nline4\n'},
  },
  // note-identifier to note content summary
  // summaries are 5 lines, maximum 140 characters
  // whichever comes first
  summary: {
    'note000': '1. eggs\n2. milk\n3. bread',
    'note001': '1. red\n2. blue\n3. green\n...',
    'note002': '1. dog\n2. cat\n3. parrot',
    'note003': '1. Borderlands\n2. Zelda\n3. Mario',
    'note004': 'do the laundry\nfile taxes',
    'note005': 'it was the best of times...',
    'note006': 'line0\nline1\nline2\nline3\nline4\n',
    'note007': 'line0\nline1\nline2\nline3\nline4\n',
    'note008': 'line0\nline1\nline2\nline3\nline4\n',
    'note009': 'line0\nline1\nline2\nline3\nline4\n',
    'note010': 'line0\nline1\nline2\nline3\nline4\n',
  }
}

export default function userReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case USER_NOTE_FETCH_UPDATE:
      return {
        ...state,
        notes: action.payload.notes,
      }
    case USER_NOTE_FETCH:
      return {
        ...state,
        content: {...state.content, ...action.payload.content}
      }
    case USER_NOTE_SET_SUMMARY:
      return {
        ...state,
        summary: {...state.summary, ...action.payload.summary}
      }
    default:
      return state
  }
}