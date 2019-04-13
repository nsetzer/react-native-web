

import React from "react";
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";

import { connect } from "react-redux";
import { setAuthenticated, pushLocation, initLocation } from '../redux/actions/routeAction'
import { env, fsGetPath } from '../redux/api'
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
    listItemRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    footer: {
        height: 100,
        width: '100%',
        backgroundColor: "rgba(200, 0, 0, .3)"
    },
});

function hasPreview(name) {
    var lst = name.split('.')
    var ext = lst[lst.length-1].toLowerCase()
    const exts = {jpg: true, png: true}
    return exts[ext]
}

class ListItem extends React.PureComponent {

    render() {
        // TODO: fix how the token is passed
        //       some documentation metions it can be passed in as
        //       an additional property for the source
        //       this is not working and the fallback token as parameter
        //       is being used instead until this can be fixed
        var url = (env.baseUrl + '/api/fs/' +
            this.props.root + '/path/')
        if (this.props.path !== '') {
            url += this.props.path + '/'
        }
        url += this.props.data.name + '?preview=thumb&token=' + this.props.token + "&dl=0"
        return (
            <View style={styles.listItemContainer}>
                <View style={styles.listItemRow}>
                {!this.props.data.isDir && hasPreview(this.props.data.name)?
                    <Image
                        style={{width: 80, height: 60}}
                        source={{uri: url, headers: {Authorization: this.props.token}}}
                    />:
                    <View style={{border: '2px solid red', width: 80, height: 60}}/>}

                    <TouchableOpacity onPress={() => {this.props.onPress(this.props.data)}}>
                        <Text>{this.props.data.name}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

function itemMapStateToProps (state) {
  return {
    token: state.userLogin.token,
  }
}

const itemBindActions = dispatch => ({
});

const ListItemC = connect(itemMapStateToProps, itemBindActions)(ListItem);

class ListFooter extends React.PureComponent {
  render() {
    return (<View style={styles.footer}></View>)
  }
}

export class Page5 extends React.Component {

    constructor(props) {
        super(props);

        const root = this.props.route.match.root
        const path = this.props.route.match.path || ''

        this.state = {
            rootNames: ['default'],
            directoryItems: [],
            root: root,
            path: path,
            parentPath: null,
            loaded: false,
            loading: root !== undefined,
        }
        console.log("page 5 constructor")
        console.log(this.props)
        if (root !== undefined) {
           fsGetPath(this.state.root, this.state.path)
               .then(this.onListDirSuccess.bind(this))
               .catch(this.onListDirError.bind(this));
       }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // sort the lists by their name

        const new_state = {}

        //const items = Object.keys(
        //    nextProps.notes).sort((a, b) =>
        //        nextProps.notes[a].title.localeCompare(nextProps.notes[b].title))
        //// conditionally update the state
        //if (items != prevState.directoryItems) {
        //    new_state['directoryItems'] = directoryItems
        //}

        const root = nextProps.route.match.root
        const path = nextProps.route.match.path || ''

        if (prevState.root != root || prevState.path != path) {
            new_state['root'] = root
            new_state['path'] = path
            new_state['loaded'] = false
            new_state['loading'] = false
        }
        // conditionally update the state
        if (Object.keys(new_state).length > 0) {
            console.log("updating state")
            console.log(new_state)
            return new_state
        }

        // no state change
        return null;
    }


    componentDidMount() {
        console.log("page5 did mount")
    }

    maybefetchContent() {
        console.log("maybe fetch content")
       if (!this.state.loading && !this.state.loaded) {
           console.log('loading content')
           if (this.state.root !== undefined) {
               this.setState({'loading': true})
               fsGetPath(this.state.root, this.state.path)
                   .then(this.onListDirSuccess.bind(this))
                   .catch(this.onListDirError.bind(this));
           }
       }
    }

    componentDidUpdate(prevState) {
        this.maybefetchContent()
    }

    onListDirSuccess(response) {
        // validate that the current state matches the expected state
        // when the function was fired
        console.log("list dir success")
        const obj = response.data.result
        console.log(obj)

        // obj.name == current root
        // obj.parent == string representing parent path
        // obj.path == string representing this path

        const dirs = obj.directories
        const files = obj.files

        const items = []
        for (var i=0; i < dirs.length; i++) {
            items.push({isDir: true, name: dirs[i]})
        }

        for (var i=0; i < files.length; i++) {
            items.push({...files[i], isDir: false})
        }

        this.setState({directoryItems: items, parentPath: obj.parent})
    }

    onListDirError(error) {
        console.log("list dir error")
        console.log(error)
        this.setState({directoryItems: [], parentPath: ''})

    }

    rootKeyExtractor = (item, index) => item;

    rootRenderItem = ({item}) => (
        <ListItemC
            data={{name:item, isDir:true}}
            onPress={this.rootOnPress}
        ></ListItemC>
    );

    rootOnPress = (data) => {
        this.props.pushLocation('/u/p5/' + data.name)
    };

    itemKeyExtractor = (item, index) => item.name;

    itemRenderItem = ({item}) => (
        <ListItemC
            root={this.state.root}
            path={this.state.path}
            data={item}
            onPress={this.itemOnPress}
        ></ListItemC>
    );

    itemOnPress = (data) => {

        if (data.isDir) {
            this.props.pushLocation(this.props.location + '/' + data.name)
        }
    };

    render() {
        console.log("page 5 render")

        const root = this.props.route.match.root
        const path = this.props.route.match.path

        if (root === undefined) {
            return (
                <View>

                <Text>select bucket</Text>
                <Text>root: {this.state.root} {root === undefined?'true':'false'}</Text>
                <Text>path: {this.state.path} {path === undefined?'true':'false'}</Text>
                <FlatList
                    data={this.state.rootNames}
                    extraData={this.state}
                    keyExtractor={this.rootKeyExtractor}
                    renderItem={this.rootRenderItem.bind(this)}
                    ListFooterComponent={ListFooter}
                    />

                </View>
            );
        } else {
            return (
                <View>

                <Text>root: {root} {root === undefined?'true':'false'}</Text>
                <Text>path: {path} {path === undefined?'true':'false'}</Text>

                <FlatList
                    data={this.state.directoryItems}
                    extraData={this.state}
                    keyExtractor={this.itemKeyExtractor}
                    renderItem={this.itemRenderItem.bind(this)}
                    ListFooterComponent={ListFooter}
                    />

                </View>
            );
        }
    }
}

function mapStateToProps (state) {
  return {
    location: state.route.location,
  }
}

const bindActions = dispatch => ({
    pushLocation: (location) => {
        dispatch(pushLocation(location))
    },
});
export default connect(mapStateToProps, bindActions)(Page5);