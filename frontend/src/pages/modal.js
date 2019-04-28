
import React from "react";
import { Animated, ScrollView, View, Text, TextInput, Button, FlatList, TouchableOpacity, TouchableWithoutFeedback , StyleSheet, Image, NativeModules, TouchableHighlight } from "react-native";
import { connect } from "react-redux";


import { modalShow, modalHide } from '../redux/actions/modalAction'

const styles = StyleSheet.create({
    outerContainer: {
        zIndex: 26,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    touchableContainer: {
        zIndex: 25,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "#00000077"
    },
    contentContainer: {
        zIndex: 25,
    }
})

export class Modal extends React.Component {

    constructor(props) {
        super(props);
    }

    accept(result=null) {
        this.props.accept(result);
        this.props.modalHide();
    }

    reject() {
        this.props.reject();
        this.props.modalHide();
    }

    render() {
        return (
            <View style={styles.outerContainer}>
                <TouchableWithoutFeedback  onPress={() => this.reject()}>
                    <View style={styles.touchableContainer}></View>
                </TouchableWithoutFeedback>
                <View style={styles.contentContainer}>
                    {this.props.render(this.accept.bind(this), this.reject.bind(this))}
                </View>
            </View>
        );
    }
}

function mapStateToProps (state) {
  return {
    accept: state.modal.accept,
    reject: state.modal.reject,
  }
}

const bindActions = dispatch => ({
    modalHide: () => {
        dispatch(modalHide())
    }
});

export default connect(mapStateToProps, bindActions)(Modal);