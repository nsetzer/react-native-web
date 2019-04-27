

import React from "react";
import { Animated, ScrollView, View, Text, TextInput, Button, FlatList, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Image, NativeModules, TouchableHighlight } from "react-native";



import { connect } from "react-redux";
import { setAuthenticated, pushLocation, initLocation } from '../redux/actions/routeAction'
import { modalShow, modalHide } from '../redux/actions/modalAction'
import { env, fsGetPath, downloadFile, uploadFile } from '../redux/api'
import { Switch, Route } from '../components/Route'

import HyperLink from '../components/HyperLink'

import {Svg, SvgFile, SvgFolder, SvgMore} from '../components/svg'

// todo web compat layer for video
// import Video from 'react-native-video';
const VideoTag = 'video'

class Video extends React.PureComponent {

    render() {

        return (
            <VideoTag src={this.props.source} controls style={{...this.props.style}}></VideoTag>
        )
    }
}

const styles = StyleSheet.create({
    listItemContainer: {
        padding: 0,
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
    },
});

const encryptionColorMap = {
    system: "#9b111e",
    server: "#0f52ba",
    client: "#FFD700",
}

function hasThumb(data) {
    var lst = data.name.split('.')
    var ext = lst[lst.length-1].toLowerCase()
    const exts = {jpg: true, png: true, bmp: true, gif: true, webm: true}
    return (data.encryption !== 'client' && data.encryption !== 'server') && exts[ext]
}

function hasPreview(data) {
    var lst = data.name.split('.')
    var ext = lst[lst.length-1].toLowerCase()
    const exts = {jpg: true, png: true, bmp: true, gif: true}
    return (data.encryption !== 'client' && data.encryption !== 'server') && exts[ext]
}

function hasVideoPreview(data) {
    var lst = data.name.split('.')
    var ext = lst[lst.length-1].toLowerCase()
    const exts = {webm: true}
    return (data.encryption !== 'client' && data.encryption !== 'server') && exts[ext]
}

class ModalDialog extends React.PureComponent {

    render() {

        return (
            <TouchableOpacity
                style={{zIndex: 20}}
                onPress={() => {this.props.dismiss()}}>
            <View style={{
                backgroundColor: "#00000033",
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 20
            }}>
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text>Hello World</Text>
            </View>
            </View>
            </TouchableOpacity>
        )
    }

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
            duration: 500,
          }
        ).start(() => {nextProps.complete && nextProps.complete()});
      }
    return {visible: nextProps.visible}
  }

  render() {
    let { fadeAnim } = this.state;

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

    //                <View style={{width: '80vw', height: '80vh', backgroundColor: 'white'}}>

    constructor(props) {
        super(props);

        this.state = {
            expand: false
        }
    }
    show_preview(accept, reject) {

        var url = (env.baseUrl + '/api/fs/' +
            this.props.root + '/path/')
        if (this.props.path !== '') {
            url += this.props.path + '/'
        }
        url += this.props.data.name + '?token=' + this.props.token + "&dl=0"

        if (hasPreview(this.props.data)) {

            return (

                <TouchableWithoutFeedback onPress={reject}>
                <View style={{width: '80vw', height: '80vh'}}>
                    <Image
                        style={{width: '100%', height: '100%'}}
                        source={{uri: url , headers: {Authorization: this.props.token}}}
                        resizeMode="contain"
                    />
                </View>
                </TouchableWithoutFeedback>
                )

        } else if (hasVideoPreview(this.props.data)) {
            //
            return (

                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{width: '80vw', height: '80vh'}}>
                    <Video
                        style={{maxWidth: '100%', maxHeight: '100%', backgroundColor: '#000000'}}
                        source={url}
                    />
                </View>
                </View>
                )
        } else {
            return (
                <View style={{height: 100, width: 100, backgroundColor: 'white'}}>
                    <Text>Hello World</Text>
                </View>
            )
        }
    }

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
        url += this.props.data.name + '?token=' + this.props.token

        // <Text numberOfLines={1} style={{padding: 10, flex: 1}}>{this.props.data.name}</Text>
        // this.setState({expand: !this.state.expand})}
        return (
            <View style={styles.listItemContainer}>
                <View style={[styles.listItemRow, {borderBottomWidth: 1}]}>

                    <View style={{
                            height: '100%',
                            backgroundColor: (encryptionColorMap[this.props.data.encryption] || '#000000'),
                            width: 10}}>
                    </View>

                <TouchableOpacity onPress={() => {
                        this.props.modalShow(this.show_preview.bind(this))
                    }}>
                {!this.props.data.isDir && hasThumb(this.props.data)?

                    <Image

                        style={{
                            borderColor: (encryptionColorMap[this.props.data.encryption] || '#000000'),
                            borderWidth: 0,width: 80, height: 60}}
                        source={{uri: url + "&preview=thumb&dl=0", headers: {Authorization: this.props.token}}}
                    />:
                    <View style={{
                            borderColor: (encryptionColorMap[this.props.data.encryption] || '#000000'),
                            borderWidth: 0}}>
                    <Svg
                        src={this.props.data.isDir ? SvgFolder : SvgFile}
                        style={{
                            fill: '#F00000',
                            borderColor: (encryptionColorMap[this.props.data.encryption] || '#000000'),
                            borderWidth: 3,
                            width: 80, height: 60}}/></View>
                }</TouchableOpacity>

                    {/*for text ellipsis, width must be set.
                        set flexGrow to grow the container
                        set width to 0 to force the trait
                    */}
                    <TouchableOpacity
                        onPress={() => {this.props.onPress(this.props.data)}}
                        style={{flexGrow: 1, width: 0, padding: 10}}>
                            <Text numberOfLines={1} style={{backgroundColor: '#0000FF33'}}>{this.props.data.name}</Text>
                    </TouchableOpacity>

                    {(!this.props.data.isDir)?
                        <TouchableOpacity onPress={() => {
                            this.setState({expand: !this.state.expand})
                        }}>
                        <Svg
                            src={SvgMore}
                            style={{width: 32, height: 32}}/>
                        </TouchableOpacity>:null}

                </View>

                {(this.state.expand && !this.props.data.isDir)?
                    <View style={{padding: 10}}>
                        <View style={styles.listItemRow}>

                        <TouchableOpacity onPress={() => {this.props.onPress(this.props.data)}}>
                            <Text style={{padding: 10}}>Download</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {}}>
                            <Text style={{padding: 10}}>Rename</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {}}>
                            <Text style={{padding: 10}}>Delete</Text>
                        </TouchableOpacity>

                        </View>
                        <Text>Version: {this.props.data.version}</Text>
                        <Text>Size: {Math.round(this.props.data.size/1024, 2)}KB</Text>
                        <Text>Encryption: {this.props.data.encryption||'none'}</Text>
                        <Text>Permission: {this.props.data.permission.toString(8)}</Text>
                        <Text>Modified Date: {new Date(this.props.data.mtime*1000).toUTCString()}</Text>
                    </View>
                    :null}

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
    modalShow: (render, accept=null, reject=null) => {
        dispatch(modalShow(render, accept, reject))
    }
});

const ListItemC = connect(itemMapStateToProps, itemBindActions)(ListItem);

class ListFooter extends React.PureComponent {
  render() {
    return (<View style={styles.footer}></View>)
  }
}

function sortStrings(a, b) {
    return a.localeCompare(b)
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
            editDialogVisible: false,
            newFolderName: "",
            uploadFiles: {},
            showDialog: false
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
            (result) => {console.log('upload fail'); console.log(result);},
            (status) => {
                var new_status = {...this.state.uploadFiles};
                new_status[status.fileName] = status;
                this.setState({uploadFiles: new_status});
                // when the upload completes remove the tracker
                if (status.finished) {
                    setTimeout(() => {
                        var new_status = {...this.state.uploadFiles};
                        delete new_status[status.fileName]
                        this.setState({uploadFiles: new_status});
                    }, 1000)
                }
            });
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

        if (!name) {
            // TODO: display an error message for invalid folder names
            // create a 'Toast' class which fades in/fades out
            // red background with a simple error string
            return
        }
        var url = this.props.location

        if (this.props.location.endsWith('/')) {
            url += name
        } else {
            url += '/' + name
        }
        this.props.pushLocation(url)
    }

    showDialog() {
        this.setState({showDialog: true})
    }

    hideDialog() {
        console.log("hide dialog")
        this.setState({showDialog: false})
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
            // {this.state.showDialog?<ModalDialog dismiss={() => this.hideDialog()}/>:null}
            //          <TouchableOpacity
            //              style={{marginRight: 5}}
            //              onPress={() => {
            //                  this.showDialog()
            //              }}>
            //              <Text style={{padding: 5}}>Show Dialog</Text>
            //          </TouchableOpacity>
            return (

                <View>


                <View style={{
                    borderBottomWidth: 1,
                    position: 'fixed',
                    backgroundColor: 'white',
                    top: 100,
                    height: 50,
                    zIndex: 10,
                    width: '100%'}}>


                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={{marginRight: 5}}
                            onPress={() => {this.goBack()}}>
                            <Text style={{padding: 5}}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{marginRight: 5}}
                            onPress={() => {this.onUploadClicked()}}>
                            <Text style={{padding: 5}}>Upload</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{marginRight: 5}}
                            onPress={() => {
                            this.setState({editDialogVisible: !this.state.editDialogVisible});
                            }}>
                            <Text style={{padding: 5}}>New Directory</Text>
                        </TouchableOpacity>

                    </View>

                    <FadeInView
                      visible={this.state.editDialogVisible}
                      complete={() => this.newFolderInput.focus()}>

                      <View>
                        <View style={[styles.listItemRow, {justifyContent: 'space-between'}]}>
                          <TextInput
                            ref={(input) => {this.newFolderInput = input}}
                            placeholder="New Folder"
                            style={{padding: 5, margin: 5, borderWidth: 1, borderColor: 'black', flexGrow: 2}}
                            onChangeText={(text) => {this.setState({newFolderName: text})}} />

                          <View style={[styles.listItemRow, {justifyContent: 'space-between'}]}>
                          <TouchableOpacity
                            onPress={() => {
                              this.onCreateFolder(this.state.newFolderName)
                              this.setState({editDialogVisible: !this.state.editDialogVisible});
                            }}>
                            <Text style={{padding: 5, margin: 5}}>Create</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({editDialogVisible: !this.state.editDialogVisible});
                            }}>
                            <Text style={{padding: 5, margin: 5}}>Cancel</Text>
                          </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </FadeInView>


                    <View>
                    {Object.keys(this.state.uploadFiles).sort(sortStrings).map(
                        (item, index) => {
                            const obj = this.state.uploadFiles[item]
                            const pct = obj.finished? 100 : (obj.bytesTransfered / obj.fileSize * 100).toFixed(0)
                            return <Text style={{backgroundColor: "#00FF0055", margin: 5}}>Uploading {obj.fileName} ... {pct} % </Text>
                        }
                    )}
                    </View>
                </View>

                <View>

                <View style={{
                    backgroundColor: 'white',
                    height: 50,
                    width: '100%'}}>
                </View>
                {this.state.loading?<Text>loading...</Text>:
                    <FlatList
                        data={this.state.directoryItems}
                        extraData={this.state}
                        keyExtractor={this.itemKeyExtractor}
                        renderItem={this.itemRenderItem.bind(this)}
                        ListFooterComponent={ListFooter}
                        />}
                </View>
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
    modalShow: (render, accept=null, reject=null) => {
        dispatch(modalShow(render, accept, reject))
    }
});

export default connect(mapStateToProps, bindActions)(Page5);