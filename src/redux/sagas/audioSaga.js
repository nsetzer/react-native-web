
import {
    AUDIO_LOAD_DOMAIN,
    AUDIO_LOAD_DOMAIN_SUCCESS,
    AUDIO_LOAD_DOMAIN_ERROR,
    AUDIO_CREATE_QUEUE,
    AUDIO_POPULATE_QUEUE,
    AUDIO_LOAD_QUEUE,
    AUDIO_LOAD_QUEUE_SUCCESS,
    AUDIO_LOAD_QUEUE_ERROR,
    AUDIO_PLAY_SONG,
    AUDIO_NEXT_SONG,
    AUDIO_PREV_SONG,
} from '../constants'

import {
    libraryGetSong,
    libraryDomainInfo,
    queueGetSongs,
    queuePopulate,
    queueCreate
} from '../api/index'

import { put, takeEvery } from 'redux-saga/effects'

function* _audioGetDomain(action) {
  try {
    console.log("saga loading domain info")
    const response = yield libraryDomainInfo()
    console.log(response.data.result)
    yield put({type: AUDIO_LOAD_DOMAIN_SUCCESS, domain: response.data.result})
  } catch (e) {
    console.log("saga loading domain info error")
    yield put({type: AUDIO_LOAD_DOMAIN_ERROR, status: e.message})
  }
}

export const audioGetDomain = takeEvery(AUDIO_LOAD_DOMAIN, _audioGetDomain);

function* _audioCreateQueue(action) {
  try {
    const response = yield queueCreate(action.query)
    yield put({type: AUDIO_LOAD_QUEUE_SUCCESS, queue: response.data.result})
  } catch (e) {
    yield put({type: AUDIO_LOAD_QUEUE_ERROR, status: e.message})
  }
}

export const audioCreateQueue = takeEvery(AUDIO_CREATE_QUEUE, _audioCreateQueue);


function* _audioPopulateQueue(action) {
  try {
    const response = yield queuePopulate()
    yield put({type: AUDIO_LOAD_QUEUE_SUCCESS, queue: response.data.result})
  } catch (e) {
    yield put({type: AUDIO_LOAD_QUEUE_ERROR, status: e.message})
  }
}

export const audioPopulateQueue = takeEvery(AUDIO_POPULATE_QUEUE, _audioPopulateQueue);

function* _audioGetQueue(action) {
  try {
    const response = yield queueGetSongs()
    yield put({type: AUDIO_LOAD_QUEUE_SUCCESS, queue: response.data.result})
  } catch (e) {
    yield put({type: AUDIO_LOAD_QUEUE_ERROR, status: e.message})
  }
}

export const audioGetQueue = takeEvery(AUDIO_LOAD_QUEUE, _audioGetQueue);