import { USER_SET_TOKEN, USER_AUTH_BEGIN, USER_AUTH_SUCCESS, USER_AUTH_FAIL } from '../constants'

const INITIAL_STATE = {
  isAuthenticating: false,
  isAuthenticated: false,
  username: null,
  token: null,
  status: null,
}

export default function userReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case USER_SET_TOKEN:
      return {
        isAuthenticating: false,
        isAuthenticated: true,
        username: action.username,
        token: action.token,
        status: null,
      }
    case USER_AUTH_BEGIN:
      return {
        isAuthenticating: true,
        isAuthenticated: false,
        username: null,
        token: null,
        status: "authenticating",
      }
    case USER_AUTH_SUCCESS:
      return {
        isAuthenticating: false,
        isAuthenticated: true,
        username: action.username,
        token: action.token,
        status: null,
      }
    case USER_AUTH_FAIL:
      return {
        isAuthenticating: false,
        isAuthenticated: false,
        username: null,
        token: null,
        status: action.status,
      }
    default:
      return state
  }
}