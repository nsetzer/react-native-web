

import React from "react";
import { Animated, View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Image, NativeModules, TouchableHighlight } from "react-native";

import { connect } from "react-redux";
import { setAuthenticated, pushLocation, initLocation } from '../redux/actions/routeAction'
import { env, fsGetPath, downloadFile, uploadFile } from '../redux/api'
import { Switch, Route } from '../components/Route'

        //console.log(NativeModules)
        //console.log(NativeModules.ReactNativeDownloadManager)

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
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 15,
    },
    footer: {
        height: 100,
        width: '100%',
        backgroundColor: "rgba(200, 0, 0, .3)"
    },
});

const encryptionColorMap = {
    system: "#9b111e",
    server: "#0f52ba",
    client: "#FFD700",
}

function hasPreview(name) {
    var lst = name.split('.')
    var ext = lst[lst.length-1].toLowerCase()
    const exts = {jpg: true, png: true, bmp: false, gif: false}
    return exts[ext]
}

class FadeInView extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
    visible: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.visible) {
        Animated.timing(
          prevState.fadeAnim,
          {
            toValue: nextProps.visible?1:0,
            duration: 1000,
          }
        ).start();
      }
    return {visible: nextProps.visible}
  }

  render() {
    let { fadeAnim } = this.state;

    console.log(fadeAnim)

    return (
      <Animated.View                 // Special animatable View
        style={{
          ...this.props.style,
          opacity: fadeAnim,         // Bind opacity to animated value
        }}
      >
        {this.props.visible? this.props.children : null}
      </Animated.View>
    );
  }
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

                        style={{
                            borderColor: (encryptionColorMap[this.props.data.encryption] || '#000000'),
                            borderWidth: 3,width: 80, height: 60}}
                        source={{uri: url, headers: {Authorization: this.props.token}}}
                    />:
                    <View style={{
                        borderColor: (encryptionColorMap[this.props.data.encryption] || '#000000'),
                        borderWidth: 3,
                        backgroundColor: (this.props.data.isDir ? 'black': 'white'),
                        width: 80, height: 60}}/>}

                    <TouchableOpacity onPress={() => {this.props.onPress(this.props.data)}}>
                        <Text style={{padding: 5}}>{this.props.data.name}</Text>
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
            modalVisible: false,
            newFolderName: ""
        }
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
            return new_state
        }

        // no state change
        return null;
    }


    componentDidMount() {
    }

    maybefetchContent() {
       if (!this.state.loading && !this.state.loaded) {
           if (this.state.root !== undefined) {
               this.setState({'loading': true, loaded: false, directoryItems: [], })
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
        const obj = response.data.result

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

        this.setState({directoryItems: items, parentPath: obj.parent,
            loading: false, loaded: true})
    }

    onListDirError(error) {
        this.setState({directoryItems: [], parentPath: '', loading: false, loaded: true})

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
            var url = this.props.location

            if (this.props.location.endsWith('/')) {
                url += data.name
            } else {
                url += '/' + data.name
            }
            this.props.pushLocation(url)
        } else {

            var url = (env.baseUrl + '/api/fs/' +
                this.state.root + '/path/')
            if (this.state.path !== '') {
                url += this.state.path + '/'
            }
            url += data.name
            // + '&token=' + this.props.token + "&dl=1"
            const token = localStorage.getItem("user_token")

            downloadFile(url, {'Authorization': token},
                (result) => {console.log(result);},
                (result) => {console.log(result);})
        }
    };

    goBack() {
        if (this.state.parentPath === this.state.path) {
            this.props.pushLocation('/u/p5')

        } else {
            const url = '/u/p5/' + this.state.root + "/" + this.state.parentPath
            this.props.pushLocation(url)

        }
    }

    onUploadClicked() {

        var url = (env.baseUrl + '/api/fs/' +
            this.state.root + '/path/')
        if (this.state.path !== '') {
            url += this.state.path + '/'
        }
        const token = localStorage.getItem("user_token")

        uploadFile(url, {'Authorization': token}, {'crypt': 'system'},
            (result) => {this.onUploadSuccess(result)},
            (result) => {console.log('upload fail'); console.log(result);});
    }

    onUploadSuccess(result) {

        // construct a temporary object to represent the
        // uploaded file in the display list.
        // insert this object at position 0 if it does not exist

        const obj = {
          encryption: "system",
          // TODO: better support for parameters in upload
          // this lastModified value is that of the original file
          // however, the upload does not pass this to the server
          // meaning a hard page refresh will show a different date
          mtime: result.lastModified,
          name: result.name,
          permission:0,
          public:null,
          size: result.size,
          version:1
        }
        console.log(result)
        console.log(obj)

        const items = this.state.directoryItems
        var found = false
        for (var i in items) {
            if (items[i].name == obj.name) {
                items[i] = obj
                found = true
                break
            }
        }
        if (!found) {
            items.unshift(obj)
        }
        this.setState({directoryItems: items})
    }

    onCreateFolder(name) {
        var url = this.props.location

        if (this.props.location.endsWith('/')) {
            url += name
        } else {
            url += '/' + name
        }
        this.props.pushLocation(url)
    }


    render() {

        const root = this.props.route.match.root
        const path = this.props.route.match.path

        if (root === undefined) {
            return (
                <View>

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
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => {this.goBack()}}>
                        <Text style={{padding: 5}}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.onUploadClicked()}}>
                        <Text style={{padding: 5}}>Upload</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.setState({modalVisible: !this.state.modalVisible});
                        }}>
                        <Text style={{padding: 5}}>New Directory</Text>
                    </TouchableOpacity>
                </View>

                <FadeInView
                  visible={this.state.modalVisible}>
                  <View>
                    <View style={[styles.listItemRow, {justifyContent: 'space-between'}]}>
                      <TextInput
                        style={{padding: 5, margin: 5, borderWidth: 1, borderColor: 'black', flexGrow: 2}}
                        onChangeText={(text) => {this.setState({newFolderName: text})}} />

                      <View style={[styles.listItemRow, {justifyContent: 'space-between'}]}>
                      <TouchableOpacity
                        onPress={() => {
                          this.onCreateFolder(this.state.newFolderName)
                          this.setState({modalVisible: !this.state.modalVisible});
                        }}>
                        <Text style={{padding: 5, margin: 5}}>Create</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({modalVisible: !this.state.modalVisible});
                        }}>
                        <Text style={{padding: 5, margin: 5}}>Cancel</Text>
                      </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </FadeInView>


                {this.state.loading?<Text>loading...</Text>:
                    <FlatList
                        data={this.state.directoryItems}
                        extraData={this.state}
                        keyExtractor={this.itemKeyExtractor}
                        renderItem={this.itemRenderItem.bind(this)}
                        ListFooterComponent={ListFooter}
                        />}

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