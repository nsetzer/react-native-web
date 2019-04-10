import { Platform } from 'react-native';
import {
    USER_NOTE_FETCH,
    USER_NOTE_FETCH_BEGIN,
    USER_NOTE_FETCH_SUCCESS,
    USER_NOTE_FETCH_ERROR,
    USER_NOTE_REQUEST_CONTENT,
    USER_NOTE_BEGIN_CONTENT,
    USER_NOTE_SET_CONTENT,
    USER_NOTE_CONTENT_ERROR
} from '../constants'
import { put, takeEvery } from 'redux-saga/effects'
import { getNotes, getNoteContent } from '../api'


function* _userNoteFetch(action) {
  try {
    yield put({type: USER_NOTE_FETCH_BEGIN})
    const notes = yield getNotes()
    console.log("on dispatch get notes")

    yield put({type: USER_NOTE_FETCH_SUCCESS, notes})
  } catch (e) {
    yield put({type: USER_NOTE_FETCH_ERROR, status: e.message})
  }
}

export const userNoteFetch = takeEvery(USER_NOTE_FETCH, _userNoteFetch);

function* _userNoteGetContent(action) {
  var content;
  try {
    console.log("on dispatch get content")

    content = {loading: true, loaded: false, error: null, text: ''}
    yield put({type: USER_NOTE_BEGIN_CONTENT, uid: action.uid, content})
    const text = yield getNoteContent(action.uid)
    console.log(text)
    content = {loading: false, loaded: true, error: null, text: text}
    yield put({type: USER_NOTE_SET_CONTENT, uid: action.uid, content})
  } catch (e) {
    content = {loading: false, loaded: false, error: e.message, text: ''}
    yield put({type: USER_NOTE_CONTENT_ERROR, uid: action.uid, content})
  }
}

export const userNoteGetContent = takeEvery(USER_NOTE_REQUEST_CONTENT, _userNoteGetContent);
