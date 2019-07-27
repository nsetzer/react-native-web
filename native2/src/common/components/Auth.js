import React from 'react';
import { Platform, BackHandler } from 'react-native';

import { connect } from "react-redux";
import { validate_token } from '../api'
import { initLocation, pushLocation } from "./Route";

const mapStateToProps = state => ({
    isAuthenticating: state.userLogin.isAuthenticating,
    isAuthenticated: state.userLogin.isAuthenticated,
    token: state.userLogin.token,
});

const bindActions = dispatch => ({
    pushLocation: (location) => {
        dispatch(pushLocation(location))
    },
    initLocation: (location) => {
        dispatch(initLocation(location))
    },
    setAuthToken: (username, token) => {
        dispatch(setAuthToken(username, token))
    }
});

const ctor = connect(mapStateToProps, bindActions);

class IAuthenticatedComponent extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        load: false
      }
    }

    checkAuth() {
        if (this.props.isAuthenticated) {
            this.setState({load: true})

        } else {
            const token = localStorage.getItem('user_token');
            const username = localStorage.getItem('user_name');
            console.log("found token: '" + token + "' and username: '" + username + "'")
            if (token !== null && username !== null) {
                // TODO: page load delay caused by this method
                // reconsider validating the token here,
                // network lag prevents rendering the screen.
                // If a token and username is found, then set the state
                // and show error messages to the user if requests fail
                // or kick the user to the login screen
                validate_token( token ).then(
                    result => {
                        console.log("HANDLE TOKEN")
                        console.log(result)

                        if (result) {
                            // TODO: setting props, state could cause a race condition
                            // will the child component render be called
                            // before the authenication is complete?
                            this.props.setAuthToken(username, token)
                            this.setState({load: true})

                        } else {
                            const token = localStorage.setItem(null);
                            const username = localStorage.setItem(null);

                            this.setState({load: false})
                            this.props.pushLocation(this.props.redirect)
                        }
                    }).catch( (error) => {
                        // handle error
                        console.log('caught error trying to auth. is the server runnig?');
                        console.log(error);
                        this.props.pushLocation(this.props.redirect)
                    })
            } else {

                this.setState({load: false})
                this.props.pushLocation(this.props.redirect)
            }
        }
    }

    componentDidMount() {

        this.checkAuth()
    }

    render() {
        console.log("render auth " + this.state.load + " :" + this.props.isAuthenticated)
        return this.state.load?this.props.children:null;
    }
}

export const AuthenticatedComponent = ctor(IAuthenticatedComponent);

class INotAuthenticatedComponent extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        load: false
      }
    }

    checkAuth() {
        if (!this.props.isAuthenticated) {
            this.setState({load: true})
        } else {
            this.setState({load: false})
            this.props.pushLocation(this.props.redirect)
        }
    }

    componentDidMount() {

        this.checkAuth()
    }

    render() {
        console.log("render not auth " + this.state.load + " :" + this.props.isAuthenticated)
        return this.state.load?this.props.children:null;
    }
}

export const NotAuthenticatedComponent = ctor(INotAuthenticatedComponent);

export const USER_LOGIN = 'USER_LOGIN'
export const USER_SET_TOKEN = 'USER_SET_TOKEN'
export const USER_CLEAR_TOKEN = 'USER_CLEAR_TOKEN'
export const USER_AUTH_BEGIN = 'USER_AUTH_BEGIN'
export const USER_AUTH_SUCCESS = 'USER_AUTH_SUCCESS'
export const USER_AUTH_FAIL = 'USER_AUTH_FAIL'
export const USER_REGISTER = 'USER_REGISTER'

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

const INITIAL_STATE = {
  isAuthenticating: false,
  isAuthenticated: false,
  username: null,
  token: null,
  status: null,
}

export function authReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case USER_SET_TOKEN:
      return {
        isAuthenticating: false,
        isAuthenticated: true,
        username: action.username,
        token: action.token,
        status: null,
      }
    case USER_CLEAR_TOKEN:

      if (Platform.OS === 'web') {
          localStorage.removeItem('user_token')
          localStorage.removeItem('user_name')
      }

      return {
        isAuthenticating: false,
        isAuthenticated: false,
        username: null,
        token: null,
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