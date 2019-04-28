
// todo: Floating Action Button / round TouchableOpacity

import React from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet, TextInput } from "react-native";

import { connect } from "react-redux";
import { setAuthenticated, pushLocation, initLocation } from '../redux/actions/routeAction'
import { userNoteFetch, userNoteRequestContent, userNoteSave, userNoteDelete } from '../redux/actions/userNoteAction'

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  inputTitle: {
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,

  },
  inputBody: {
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    height: '50vh'
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-begin',
    padding: 5,
  },
  button: {
    margin: 5,
    padding: 5,
  }
});

export class Page4Edit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            defaultTextSet: false,
            defaultText: '',
            currentText: '',
            defaultTitleSet: false,
            defaultTitle: '',
            currentTitle: '',
            height: 0
        }
    }

    componentDidMount() {

        // load the list of notes if it has no already been loaded
        if (!this.props.loaded) {
            if (!this.props.loading && this.props.error === null) {
                this.props.userNoteFetch()
            }
        }

        this._forceUpdate()
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        const uid = nextProps.route.match.uid
        var text = ''
        var title = ''

        if (!nextProps.loaded) {
            return null
        }

        const new_state = {}
        if (uid) {
            if (nextProps.content[uid].loaded) {
                text = nextProps.content[uid].text
                new_state['defaultText'] = text
            } else if (!nextProps.content[uid].loading && nextProps.content[uid].error === null) {
                nextProps.userNoteRequestContent(uid)
            }

            title = nextProps.notes[uid].title
            if (title != prevState.defaultTitle) {
                new_state['defaultTitle'] = title
                new_state['defaultTitleSet'] = false
            }
        }

        new_state.disabled = nextProps.content[uid] && nextProps.content[uid].saving

        // conditionally update the state
        if (Object.keys(new_state).length > 0) {
            return new_state
        }

        // no state change
        return null;
    }

    componentWillUnmount() {
        this.setState({
            defaultTextSet: false,
            defaultText: '',
            currentText: '',
            defaultTitleSet: false,
            defaultTitle: '',
            currentTitle: ''
        })
    }

    componentDidUpdate() {
        this._forceUpdate()
    }

    _forceUpdate() {

        // check to see if the default text has been set

        const uid = this.props.route.match['uid']
        if (!this.state.defaultTextSet) {
            if ( this.props.content[uid] &&  this.props.content[uid].loaded) {
                this._inputText.setNativeProps({text: this.state.defaultText})
                this.setState({defaultTextSet: true,
                    currentText:this.state.defaultText})
            }
        }

        if (!this.state.defaultTitleSet) {
            this._inputTitle.setNativeProps({text: this.state.defaultTitle})
            this.setState({defaultTitleSet: true,
                    currentTitle:this.state.defaultTitle})
        }
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

            <View style={styles.buttonContainer}>
                <Button
                    title='Cancel'
                    onPress={() => {this.props.pushLocation('/u/p4')}}
                    disabled={this.props.content[uid] && this.props.content[uid].saving}
                />
                <View style={{width: 20}}/>
                <Button title='Save' onPress={() => {
                    this.props.userNoteSave(uid, this.state.currentTitle,
                        this.state.currentText,
                        () => this.props.pushLocation('/u/p4'))}}
                    disabled={this.props.content[uid] && this.props.content[uid].saving}
                />
            </View>

            <Text>Title:</Text>

            <TextInput
                style={styles.inputTitle}
                onChangeText={(currentTitle) => this.setState({currentTitle})}
                ref={component => this._inputTitle = component}
                />

            <Text>Content:</Text>

            <TextInput
                style={styles.inputBody}
                multiline={true}
                onChangeText={(currentText) => this.setState({currentText})}
                ref={component => this._inputText = component}
                />

            </View>

        )
    }
}


function mapStateToProps (state) {
  return {
    authenticated: state.route.authenticated,
    loaded: state.userNote.loaded,
    loading: state.userNote.loading,
    error: state.userNote.error,
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
    },
    userNoteRequestContent: (uid) => {
        dispatch(userNoteRequestContent(uid))
    },
    userNoteFetch: () => {
        dispatch(userNoteFetch())
    },
    userNoteSave: (uid, title, content, redirect=null) => {
        dispatch(userNoteSave(uid, title, content, redirect))
    },
    userNoteDelete: (uid) => {
        dispatch(userNoteDelete(uid))
    },
});

export default connect(mapStateToProps, bindActions)(Page4Edit);

