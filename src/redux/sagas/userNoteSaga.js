import {
    USER_NOTE_FETCH,
    //USER_NOTE_FETCH_BEGIN,
    USER_NOTE_FETCH_SUCCESS,
    USER_NOTE_FETCH_ERROR,
    USER_NOTE_REQUEST_CONTENT,
    //USER_NOTE_BEGIN_CONTENT,
    USER_NOTE_SET_CONTENT,
    USER_NOTE_CONTENT_ERROR,
    USER_NOTE_SAVE,
    USER_NOTE_SAVE_SUCCESS,
    USER_NOTE_SAVE_ERROR,
    USER_NOTE_DELETE,
    USER_NOTE_DELETE_SUCCESS,
    USER_NOTE_DELETE_ERROR,
} from '../constants'
import { put, takeEvery } from 'redux-saga/effects'
import { getNotes, getNoteContent, saveNote, deleteNote } from '../api/index'


function* _userNoteFetch(action) {
  try {
    const response = yield getNotes()
    yield put({type: USER_NOTE_FETCH_SUCCESS, notes: response.data.result})
  } catch (e) {
    yield put({type: USER_NOTE_FETCH_ERROR, status: e.message})
  }
}

export const userNoteFetch = takeEvery(USER_NOTE_FETCH, _userNoteFetch);

function* _userNoteGetContent(action) {
  var content;
  try {
    const response = yield getNoteContent(action.uid)
    content = {loading: false, loaded: true, error: null, saving:false, deleting: false, text: response.data}
    yield put({type: USER_NOTE_SET_CONTENT, uid: action.uid, content})
  } catch (e) {
    // e.g. 404
    content = {loading: false, loaded: false, error: e.message, saving:false, deleting: false, text: ''}
    yield put({type: USER_NOTE_CONTENT_ERROR, uid: action.uid, content})
  }
}

export const userNoteGetContent = takeEvery(USER_NOTE_REQUEST_CONTENT, _userNoteGetContent);


function* _userNoteSave(action) {
  var content;
  try {
    const response = yield saveNote(action.uid, action.content)
    yield put({type: USER_NOTE_SAVE_SUCCESS, uid: action.uid, text:action.content})
    if (action.success_redirect !== null) {
      action.success_redirect()
    }
  } catch (e) {
    content = {error: e.message, saving:false}
    yield put({type: USER_NOTE_SAVE_ERROR, uid: action.uid, content})
  }
}

export const userNoteSave = takeEvery(USER_NOTE_SAVE, _userNoteSave);

function* _userNoteDelete(action) {
  var content;
  try {
    const response = yield deleteNote(action.uid)
    yield put({type: USER_NOTE_DELETE_SUCCESS, uid: action.uid})
  } catch (e) {
    content = {error: e.message, saving:false}
    yield put({type: USER_NOTE_DELETE_ERROR, uid: action.uid})
  }
}

export const userNoteDelete = takeEvery(USER_NOTE_DELETE, _userNoteDelete);