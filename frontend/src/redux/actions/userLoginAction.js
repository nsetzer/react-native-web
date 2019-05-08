import { USER_LOGIN, USER_SET_TOKEN, USER_CLEAR_TOKEN } from '../constants'

export function userLogin(username, password) {
    return {
        type: USER_LOGIN,
        username,
        password
    }
}

export function setAuthToken(username, token) {
    return {
        type: USER_SET_TOKEN,
        username,
        token
    }
}

export function clearAuthToken() {
    return {
        type: USER_CLEAR_TOKEN,
    }
}
