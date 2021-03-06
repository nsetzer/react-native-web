import { FETCHING_DATA, FETCHING_DATA_SUCCESS, FETCHING_DATA_FAILURE } from '../constants'
import { put, takeEvery } from 'redux-saga/effects'
import {getPeople} from '../../common/api'

function* fetchData (action) {
  try {
    const data = yield getPeople()
    yield put({ type: FETCHING_DATA_SUCCESS, data })
  } catch (e) {
    yield put({ type: FETCHING_DATA_FAILURE })
  }
}

export default takeEvery(FETCHING_DATA, fetchData)