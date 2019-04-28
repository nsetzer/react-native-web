import React from 'react';
import { Platform, BackHandler } from 'react-native';

import { connect } from "react-redux";
import { validate_token } from '../redux/api'
import { initLocation, pushLocation } from "../redux/actions/routeAction";
import { setAuthToken } from "../redux/actions/userLoginAction";

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

    componentWillMount() {

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

    componentWillMount() {

        this.checkAuth()
    }

    render() {
        console.log("render not auth " + this.state.load + " :" + this.props.isAuthenticated)
        return this.state.load?this.props.children:null;
    }
}

export const NotAuthenticatedComponent = ctor(INotAuthenticatedComponent);
