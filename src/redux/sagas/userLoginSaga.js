import { Platform } from 'react-native';
import { USER_LOGIN, USER_AUTH_BEGIN, USER_AUTH_SUCCESS, USER_AUTH_FAIL } from '../constants'
import { put, takeEvery } from 'redux-saga/effects'
import { authenticate } from '../api/index'

function* userLogin (action) {
  try {
    const username = action.username
    const password = action.password
    yield put({type: USER_AUTH_BEGIN})

    const token = yield authenticate(username, password)

    console.log("get token")
    console.log(token.data.token)
    if (Platform.OS === 'web') {
        localStorage.setItem('user_token', token.data.token)
        localStorage.setItem('user_name', username)
    }

    yield put({type: USER_AUTH_SUCCESS, username, token: token.data.token})
  } catch (e) {
    if (Platform.OS === 'web') {
        localStorage.setItem('user_token', null)
        localStorage.setItem('user_name', null)
    }
    yield put({type: USER_AUTH_FAIL, status: e.message})
  }
}

export default takeEvery(USER_LOGIN, userLogin)