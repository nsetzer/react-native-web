
// todo: Floating Action Button / round TouchableOpacity

import React from "react";
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";

import { connect } from "react-redux";
import { setAuthenticated, pushLocation, initLocation } from '../redux/actions/routeAction'
import { userNoteFetch, userNoteRequestContent, userNoteDelete, userNoteCreate } from '../redux/actions/userNoteAction'
import { Switch, Route } from '../common/components/Route'
import { Markdown } from '../common/components/markdown'
import { Svg, SvgEdit, SvgDiscard } from '../common/components/svg'

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
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 5,
  },
});

function zeropad(num, size) {
    var s = "" + num;
    while (s.length < size) {
        s = "0" + s
    }
    return s
}

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

    _onDelete = () => {
        this.props.userNoteDelete(this.props.id)
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
                        <View>
                        <View style={styles.row}>

                        {this.state.hideSummary?
                            null:
                            /*onPress={this._onDelete}*/
                            // this.props.content[this.props.id] && this.props.content[this.props.id].deleting
                            <TouchableOpacity onPress={() => { if (
                                !(this.props.content[this.props.id] &&
                                    this.props.content[this.props.id].deleting)) {
                                console.error('this._onDelete()')}}}>
                                <Svg src={SvgDiscard} style={{width: 32, height: 32}}/>
                            </TouchableOpacity>
                        }
                        <View style={{width: 10}} />
                            <TouchableOpacity onPress={this._onEdit}>
                                <Svg src={SvgEdit} style={{width: 32, height: 32}}/>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={styles.summaryContainer}>
                    <Markdown source={this._getText()}/>
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
    },
    userNoteDelete: (uid) => {
        dispatch(userNoteDelete(uid))
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
                nextProps.notes[a].title.localeCompare(nextProps.notes[b].title))
        // conditionally update the state
        if (note_list != prevState.note_list) {
            return {note_list: note_list}
        }

        // no state change
        return null;
    }

    keyExtractor = (item, index) => item;

    _onCreate = () => {
        var counter = 0;
        var uid = 'note' + zeropad(counter, 3) + '.txt'
        while (this.props.notes[uid] !== undefined) {
            counter += 1
            uid = 'note' + zeropad(counter, 3) + '.txt'
        }

        this.props.userNoteCreate(uid)

    }

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
            title={this.props.notes[item].title}
            onPressItem={this.onPressItem}
            selected={!!this.state.selected[item]}
        ></ListItemC>
    );

    render() {
        return (
            <View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => {this.props.userNoteFetch()}}>
                    <Text style={{padding: 5}}>Refresh</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this._onCreate()}}>
                    <Text style={{padding: 5}}>New</Text>
                </TouchableOpacity>
            </View>

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
    },
    userNoteCreate: (uid) => {
        dispatch(userNoteCreate(uid))
    },

});
export default connect(mapStateToProps, bindActions)(Page4);

