
// todo: Floating Action Button / round TouchableOpacity

import React from "react";
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, TextInput } from "react-native";

import { connect } from "react-redux";
import { setAuthenticated, pushLocation, initLocation } from '../redux/actions/routeAction'
import { Switch, Route } from '../components/Route'

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  inputTitle: {
    heightborderColor: 'gray',
    borderWidth: 1,
    margin: 10,

  },
  inputBody: {
    heightborderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    height: '50vh'
  }
});

export class Page4Edit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            defaultText: '',
            currentText: '',
            defaultTitle: '',
            currentTitle: '',
            height: 0
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        const uid = nextProps.route.match['uid']
        var text = ''
        var title = ''

        if (uid) {
            text = nextProps.content[uid].text
            title = nextProps.notes[uid]
        }

        // conditionally update the state
        if (text != prevState.defaultText || title != prevState.defaultTitle) {
            return {defaultText: text, defaultTitle: title}
        }

        // no state change
        return null;
    }

    render() {
        /*
        {[styles.inputBody, {height: Math.max(35, this.state.height)}
        onContentSizeChange={(event) => {
                    this.setState({ height: event.nativeEvent.contentSize.height })
                }}
                scrollEnabled={false}
        */

        // TODO: validate title
        // if the title is not the same as the original title
        // then it cannot match any existing title
        const uid = this.props.route.match['uid'];
        return (
            <View style={styles.container}>


            <Text>Title:</Text>

            <TextInput
                style={styles.inputTitle}
                defaultValue={this.state.defaultTitle}
                onChangeText={(currentTitle) => this.setState({currentTitle})}
                />

            <Text>Content:</Text>

            <TextInput
                style={styles.inputBody}
                multiline={true}
                defaultValue={this.state.defaultText}
                onChangeText={(currentText) => this.setState({currentText})}

                />

            </View>
        )
    }
}


function mapStateToProps (state) {
  return {
    authenticated: state.route.authenticated,
    notes: state.userNote.notes,
    content: state.userNote.content,
    summary: state.userNote.summary,
  }
}


const bindActions = dispatch => ({
    setAuthenticated: (authenticated) => {
        dispatch(setAuthenticated(authenticated))
    },
    pushLocation: (location) => {
        dispatch(pushLocation(location))
    },
    initLocation: (location) => {
        dispatch(initLocation(location))
    }
});

export default connect(mapStateToProps, bindActions)(Page4Edit);

