
// todo: Floating Action Button / round TouchableOpacity

import React from "react";
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";

import { connect } from "react-redux";
import { setAuthenticated, pushLocation, initLocation } from '../redux/actions/routeAction'
import { userNoteFetch, userNoteRequestContent } from '../redux/actions/userNoteAction'
import { Switch, Route } from '../components/Route'

const styles = StyleSheet.create({
  listItemContainer: {
    padding: 10,
    borderColor: '#000000',
    borderWidth: 1,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: "#FFFFFF",
    shadowOffset: {  width: 4,  height: 4,  },
    shadowColor: '#000000',
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  titleContainer: {
    borderBottomColor: '#000000',
    borderBottomWidth: 2,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  summaryContainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  footer: {
    height: 100,
    width: '100%',
    backgroundColor: "rgba(200, 0, 0, .3)"
  }
});


class ListItem extends React.PureComponent {

    state = {hideSummary: true};

    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };

    _onToggle = () => {

        const obj = this.props.content[this.props.id]

        // check for an invalid id
        if (!obj) {
            return
        }

        if (obj.loaded) {
            this.setState({hideSummary: !this.state.hideSummary})
        } else {

            // if not loaded, and not loading, request data
            if (!obj.loading) {
                this.props.userNoteRequestContent(this.props.id)
            }

            this.setState({hideSummary: false})
        }

    };

    _onEdit = () => {
        const url = '/u/p4/' + this.props.id
        this.props.pushLocation(url)
    }

    _getText() {

        if (this.props.error != null) {
            return this.props.error
        }

        if (this.props.content[this.props.id].loading) {
            return "loading content..."
        }

        if (this.state.hideSummary) {
            return ""
        }

        return this.props.content[this.props.id].text
    }

    render() {
        const textColor = this.props.selected ? 'red' : 'black';
        return (
            <View style={styles.listItemContainer}>
                <TouchableOpacity onPress={this._onToggle}>
                    <View style={styles.titleContainer}>
                        <Text style={{color: textColor}}>{this.props.title}</Text>
                        <Button title="edit" onPress={this._onEdit} />
                    </View>
                </TouchableOpacity>
                <View style={styles.summaryContainer}>
                    <Text>{this._getText()}</Text>
                </View>
            </View>
        );
    }
}

function itemMapStateToProps (state) {
  return {
    content: state.userNote.content
  }
}

const itemBindActions = dispatch => ({
    pushLocation: (location) => {
        dispatch(pushLocation(location))
    },
    userNoteRequestContent: (uid) => {
        dispatch(userNoteRequestContent(uid))
    }
});

const ListItemC = connect(itemMapStateToProps, itemBindActions)(ListItem);


class ListFooter extends React.PureComponent {
  render() {
    return (<View style={styles.footer}></View>)
  }
}

export class Page4 extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            note_list: [],
            selected: {},
        }
    }

    componentDidMount() {

        if (!this.props.loaded) {
            if (!this.props.loading && this.props.error === null) {
                console.log("requesting notes list")
                console.log(this.props.loaded)
                console.log(this.props.loading)
                console.log(this.props.error)
                this.props.userNoteFetch()
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // sort the lists by their name
        const note_list = Object.keys(
            nextProps.notes).sort((a, b) =>
                nextProps.notes[a].localeCompare(nextProps.notes[b]))
        // conditionally update the state
        if (note_list != prevState.note_list) {
            return {note_list: note_list}
        }

        // no state change
        return null;
    }

    keyExtractor = (item, index) => item;

    onPressItem = (id) => {
        // updater functions are preferred for transactional updates
        this.setState((state) => {
        // copy the map rather than modifying state.
        const value = (!state.selected[id])
        const selected = {};
        selected[id] = value
        return {selected};
        });
    };

    renderItem = ({item}) => (
        <ListItemC
            id={item}
            title={this.props.notes[item]}
            onPressItem={this.onPressItem}
            selected={!!this.state.selected[item]}
        ></ListItemC>
    );

    render() {
        return (
            <View>


            {(this.props.error !== null)
              ?<Text>{this.props.error}</Text>
              :(this.props.loading)
              ?<Text>Loading...</Text>
              :<FlatList
                    data={this.state.note_list}
                    extraData={this.state}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem.bind(this)}
                    ListFooterComponent={ListFooter}
                    />
            }

            </View>
        )
    }
}


function mapStateToProps (state) {
  return {
    authenticated: state.route.authenticated,
    loading: state.userNote.loading,
    loaded: state.userNote.loaded,
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
    userNoteFetch: () => {
        dispatch(userNoteFetch())
    }
});
export default connect(mapStateToProps, bindActions)(Page4);

