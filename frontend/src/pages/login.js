
import React from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Image,
  Button,
  StyleSheet,
  StatusBar
} from 'react-native';

import { connect } from "react-redux";

import { initLocation, pushLocation } from "../redux/actions/routeAction";
import { userLogin } from "../redux/actions/userLoginAction";

// define your styles
const styles1 = StyleSheet.create({
    container: {
        padding: 20,
        width: '100%',
    },
    input:{
        height: 40,
        backgroundColor: 'rgba(225,225,225,0.2)',
        marginBottom: 10,
        padding: 10,
        color: '#fff'
    },
    buttonContainer:{
        backgroundColor: '#2980b6',
        paddingVertical: 15
    },
    buttonText:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    },
    loginButton:{
      backgroundColor:  '#2980b6',
       color: '#fff'
    }

});

// define your styles
const styles2 = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#2c3e50',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginContainer:{
        alignItems: 'center',
        flexGrow: 1,
        width: '100%',
        justifyContent: 'center'
    },
    formContainer:{
        alignItems: 'center',
        flexGrow: 1,
        width: '100%',
        justifyContent: 'center'
    },
    logo: {
        position: 'absolute',
        width: 300,
        height: 100
    },
    title:{
        color: "#FFF",
        marginTop: 120,
        width: 180,
        textAlign: 'center',
        opacity: 0.9
    }
});


class ILoginForm extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
          username: '',
          password: '',
      }
    }

    componentWillMount() {
        //if (this.props.isAuthenticated) {
        //  this.props.pushLocation('/u/queue')
        //}
    }

    componentDidUpdate() {
        if (this.props.isAuthenticated) {
          this.props.pushLocation('/u/queue')
        }
    }

    onUsernameChange(event) {
      this.setState({username: event.target.value})
      console.log(event.target.value)
    }

    onPasswordChange(event) {
      this.setState({password: event.target.value})
      console.log(event.target.value)
    }

    render() {
        return (
            <View style={styles1.container}>
                <StatusBar barStyle="light-content"/>
                {(this.props.status!==null)?<Text>{this.props.status}</Text>:null}
                <TextInput style = {styles1.input}
                            autoCapitalize="none"
                            onSubmitEditing={() => this.passwordInput.focus()}
                            autoCorrect={false}
                            keyboardType='email-address'
                            returnKeyType="next"
                            placeholder='Email'
                            onChange={this.onUsernameChange.bind(this)}
                            placeholderTextColor='rgba(225,225,225,0.7)'/>

                <TextInput style = {styles1.input}
                           returnKeyType="go" ref={(input)=> this.passwordInput = input}
                           placeholder='Password'
                           placeholderTextColor='rgba(225,225,225,0.7)'
                           onChange={this.onPasswordChange.bind(this)}
                           secureTextEntry/>

                <Button
                    title='LOGIN'
                    onPress={() => {this.props.userLogin(this.state.username, this.state.password)}}>
                </Button>
            </View>
        );
    }
}

class ILoginPage extends React.Component {
    render() {
        console.log("render login")
        return (
        <KeyboardAvoidingView behavior="padding" style={styles2.container}>

                <View style={styles2.loginContainer}>
                    <Image resizeMode="contain" style={styles2.logo} source={require('../common/assets/images/tree128.png')} />

                    </View>
               <View style={styles2.formContainer}>
                   <LoginForm />
               </View>

            </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = state => ({
    //location: state.route.location,
    //authenticated: state.route.authenticated
    isAuthenticating: state.userLogin.isAuthenticating,
    isAuthenticated: state.userLogin.isAuthenticated,
    status: state.userLogin.status,
});

const bindActions = dispatch => ({
    pushLocation: (location) => {
        dispatch(pushLocation(location))
    },
    initLocation: (location) => {
        dispatch(initLocation(location))
    },
    userLogin: (username, password) => {
        dispatch(userLogin(username, password))
    }
});

const ctor = connect(mapStateToProps, bindActions);
export const LoginForm = ctor(ILoginForm);
const LoginPage = ctor(ILoginPage);
export default LoginPage;

