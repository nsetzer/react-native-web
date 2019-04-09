
import React from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
  StatusBar
} from 'react-native';

import { connect } from "react-redux";

import { initLocation, pushLocation } from "../redux/actions/routeAction";


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

class IHomeForm extends React.Component {
    render() {

        /*
        <TouchableOpacity
                style={styles1.buttonContainer}
                onPress={() => {this.props.pushLocation("/login")}}>
                    <Text  style={styles1.buttonText}>LOGIN</Text>
        </TouchableOpacity>
        */
        return (
            <View style={styles1.container}>
                <StatusBar barStyle="light-content"/>

                <Button
                    title='LOGIN'
                    onPress={() => {this.props.pushLocation("/login")}}>
                </Button>
            </View>
        );
    }
}

class IHomePage extends React.Component {
    render() {
        return (
        <KeyboardAvoidingView behavior="padding" style={styles2.container}>

                <View style={styles2.loginContainer}>
                    <Image resizeMode="contain" style={styles2.logo} source={require('../assets/images/robot-dev.png')} />
                </View>
               <View style={styles2.formContainer}>
                   <HomeForm />
               </View>

            </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = state => ({
    location: state.route.location,
    authenticated: state.route.authenticated
});

const bindActions = dispatch => ({
    pushLocation: (location) => {
        dispatch(pushLocation(location))
    },
    initLocation: (location) => {
        dispatch(initLocation(location))
    }
});

const ctor = connect(mapStateToProps, bindActions);
export const HomeForm = ctor(IHomeForm);
const HomePage = ctor(IHomePage);
export default HomePage;

