
// todo: Floating Action Button / round TouchableOpacity

import React from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";

import { connect } from "react-redux";
import { setAuthenticated, pushLocation, initLocation } from '../redux/actions/routeAction'
import { userNoteFetch, userNoteRequestContent } from '../redux/actions/userNoteAction'

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
    justifyContent: 'flex-begin'
  },
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
                console.log("load notes")
                this.props.userNoteFetch()
            }
        }

        this._forceUpdate()
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        console.log("4 state from props")

        const uid = nextProps.route.match['uid']
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

            title = nextProps.notes[uid]
            if (title != prevState.defaultTitle) {
                new_state['defaultTitle'] = title
                new_state['defaultTitleSet'] = false
            }
        }

        // conditionally update the state
        if (Object.keys(new_state).length > 0) {
            return new_state
        }

        // no state change
        return null;
    }

    componentWillUnmount() {
        console.log("4 did unmount" + this.state.defaultTextSet)
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
        console.log("4 did update" + this.state.defaultTextSet)

        const uid = this.props.route.match['uid']
        if (!this.state.defaultTextSet) {
            if ( this.props.content[uid] &&  this.props.content[uid].loaded) {
                this._inputText.setNativeProps({text: this.state.defaultText})
                this.setState({defaultTextSet: true})
            }
        }

        if (!this.state.defaultTitleSet) {
            this._inputTitle.setNativeProps({text: this.state.defaultTitle})
            this.setState({defaultTitleSet: true})
        }
    }

    render() {
        console.log("4 did render" + this.state.defaultTextSet)
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
    }
});

export default connect(mapStateToProps, bindActions)(Page4Edit);

