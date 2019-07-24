

import React from "react";
import { Animated, ScrollView, View, Text, TextInput, Button, FlatList, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Image, NativeModules, TouchableHighlight } from "react-native";

import { connect } from "react-redux";
import { setAuthenticated, pushLocation, initLocation } from '../redux/actions/routeAction'
import { modalShow, modalHide } from '../redux/actions/modalAction'
import { env, fsGetPath, fsSearch, downloadFile, uploadFile, storageRevokePublicUri, storageGeneratePublicUri } from '../common/api'
import { Switch, Route } from '../common/components/Route'

import HyperLink from '../common/components/HyperLink'

import {Svg, SvgFile, SvgFolder, SvgMore, SvgMediaError} from '../common/components/svg'

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

function dirpath(str, prefix="") {
    if (str === null || str === undefined) {
        return ""
    }
    if (!str) {
        return prefix
    }
    return prefix + (new String(str).substring(0, str.lastIndexOf('/')))
}

function hasThumb(data) {
    var lst = data.name.split('.')
    var ext = lst[lst.length-1].toLowerCase()
    const exts = {jpg: true, jpeg: true, png: true, bmp: true, gif: true, webm: true}
    return (data.encryption !== 'client' && data.encryption !== 'server') && exts[ext]
}

function hasPreview(data) {
    var lst = data.name.split('.')
    var ext = lst[lst.length-1].toLowerCase()
    const exts = {jpg: true, jpeg: true, png: true, bmp: true, gif: true}
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
    fadeAnim: 0,  // Initial value for opacity: 0
    visible: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.visible && !prevState.visible) {
        console.log("set timer")
        var fadeAnim = new Animated.Value(0)
        Animated.timing(
          fadeAnim,
          {
            toValue: nextProps.visible?1:0,
            duration: 500,
          }
        ).start(() => {nextProps.complete && nextProps.complete()});

        return {visible: nextProps.visible, fadeAnim}
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
            expand: false,
            public: null,  // set when a new link is generated and valid is false
            valid: true,  // indicates that prop.data.public is valid

            iconLoading: false,
            iconError: false,
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

                <View style={{maxWidth: '80vw', maxHeight: '80vh', flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Video
                        style={{maxWidth: '100%', maxHeight: '100%', backgroundColor: '#000000'}}
                        source={url}
                    />
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

    onGeneratePublicLink() {

        var path = ''
        if (this.props.path !== '') {
            path += this.props.path + '/'
        }
        path += this.props.data.name

        storageGeneratePublicUri(this.props.root, path).then(
            result => {this.setState({public: result.data.result.id, valid:false})},
            error => {console.log(error)}
        );

    }

    onRevokePublicLink() {
        var path = ''
        if (this.props.path !== '') {
            path += this.props.path + '/'
        }
        path += this.props.data.name

        storageRevokePublicUri(this.props.root, path).then(
            result => {this.setState({public: null, valid:false})},
            error => {console.log(error)}
        );
    }

    onOpenPublicLink() {
        const public_id = this.state.valid?this.props.data.public:this.state.public
        const url = env.baseUrl + "/p/" + public_id
        var win = window.open(url, '_blank');
        win.focus()
    }

    render_icon_impl(url) {

        var borderColor = encryptionColorMap[this.props.data.encryption] || '#000000';
        if (!this.props.data.isDir && hasThumb(this.props.data)) {
            return (<Image
                        style={{
                            borderColor: (this.state.iconLoading)?'#777777':borderColor,
                            backgroundColor: (this.state.iconLoading)?'#777777':borderColor,
                            borderWidth: 0,
                            width: 80,
                            height: 60
                        }}
                        source={{uri: url + "&preview=thumb&dl=0", headers: {Authorization: this.props.token}}}
                        onLoadStart={(e) => this.setState({iconLoading: true})}
                        onLoadEnd={(e) => this.setState({iconLoading: false})}
                        onError={(e) => {console.log(e); this.setState({iconError: true})}}

                    />);
        } else {
            return (<View style={{
                            borderColor: borderColor,
                            borderWidth: 0}}>
                        <Svg
                            src={this.props.data.isDir ? SvgFolder : SvgFile}
                            style={{
                                fill: '#F00000',
                                borderColor: (encryptionColorMap[this.props.data.encryption] || '#000000'),
                                borderWidth: 3,
                                width: 80, height: 60}}/>
                    </View>);
        }
    }

    render_icon(url) {
        if (this.state.iconError) {
            return (<View style={{
                            borderColor: (encryptionColorMap[this.props.data.encryption] || '#000000'),
                            borderWidth: 0}}>
                        <Svg
                            src={SvgMediaError}
                            style={{
                                fill: '#F00000',
                                borderColor: (encryptionColorMap[this.props.data.encryption] || '#000000'),
                                borderWidth: 3,
                                width: 80, height: 60}}/>
                    </View>);
        }
        return (<TouchableOpacity onPress={() => {
                        this.props.modalShow(this.show_preview.bind(this))
                    }}>
                    {this.render_icon_impl(url)}
                </TouchableOpacity>);
    }

    render_content(url) {
        if (this.props.data.isDir) {
            return (<TouchableOpacity
                            onPress={() => {this.props.onPress(this.props.data)}}
                            style={{flexGrow: 1, width: 0, padding: 10}}>
                                <Text numberOfLines={1} ellipsizeMode='middle'>{this.props.data.name}</Text>
                    </TouchableOpacity>);
        } else {
            // display the name of the file
            // if part of a search, display the directory as well
            return (<View style={{flexGrow: 1, width: 0, padding: 10}}>
                        <Text numberOfLines={1} ellipsizeMode={'middle'}>{this.props.data.name}</Text>

                        <TouchableOpacity
                            onPress={() => {this.props.onPress(null, dirpath(this.props.dataPath, this.props.root + "/"))}}
                            style={{flexGrow: 1}}>
                            <Text numberOfLines={1} ellipsizeMode={'middle'}>{dirpath(this.props.dataPath, this.props.root + "/")}</Text>
                        </TouchableOpacity>
                    </View>);
        }
    }

    render_more() {

        if (!this.props.data.isDir) {
            return (<View style={{marginLeft: 20, marginRight: 20}}>
                        <TouchableOpacity onPress={() => {
                            this.setState({expand: !this.state.expand})
                        }}>
                        <Svg
                            src={SvgMore}
                            style={{width: 32, height: 32}}/>
                        </TouchableOpacity>
                    </View>);
        } else {
            return null;
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


        const public_id = this.state.valid?this.props.data.public:this.state.public

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

                    {this.props.dataPath?<Text style={{padding: 10}}>{1+this.props.index}</Text>:null}

                    {this.render_icon(url)}

                    {/*for text ellipsis, width must be set.
                        set flexGrow to grow the container
                        set width to 0 to force the trait
                    */}
                    {this.render_content(url)}

                    {/*extra margin on the right to improve scroll experience on mobile*/}


                    {this.render_more()}

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
                        <Text>Name: {this.props.data.name}</Text>
                        <Text>Version: {this.props.data.version}</Text>
                        <Text>Size: {Math.round(this.props.data.size/1024, 2)}KB</Text>
                        <Text>Encryption: {this.props.data.encryption||'none'}</Text>
                        <Text>Permission: {this.props.data.permission.toString(8)}</Text>
                        <Text>Modified Date: {new Date(this.props.data.mtime*1000).toUTCString()}</Text>
                        {public_id?<View><TouchableOpacity onPress={() => {this.onOpenPublicLink()}}><Text>Public: {public_id}</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => {this.onRevokePublicLink()}}>
                                <Text style={{padding: 10}}>Delete Public Link</Text>
                            </TouchableOpacity>
                            </View>:
                            <TouchableOpacity onPress={() => {this.onGeneratePublicLink()}}>
                                <Text style={{padding: 10}}>Generate Public Link</Text>
                            </TouchableOpacity>}
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

export class StoragePage extends React.Component {

    constructor(props) {
        super(props);

        const root = this.props.route.match.root
        const path = this.props.route.match.path || ''

        this.state = {
            rootNames: [
                {name: 'default', text: 'All Files'},
                {name: 'public', text: 'Public Files'},
            ],
            directoryItems: [],
            root: root,
            path: path,
            parentPath: null,
            loaded: false,
            loading: root !== undefined,
            editDialogVisible: false,
            newFolderName: "",
            uploadFiles: {},
            showDialog: false,
            query: "",
            active_query: null,
            next_page: -1,
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

                const next_state = {
                    'loading': true,
                    loaded: false,
                    directoryItems: [],
                    next_page: -1
                }

                this.setState(next_state,
                    () => {

                       // TODO: if root is 'public' use an alternative api to list
                       // only public files

                        if (this.state.active_query !== null) {
                            fsSearch(this.state.root,
                                     this.state.path,
                                     this.state.active_query, 0, 25)
                            .then(this.onSearchSuccess.bind(this))
                            .catch(this.onListDirError.bind(this));
                        } else {
                            fsGetPath(this.state.root, this.state.path)
                            .then(this.onListDirSuccess.bind(this))
                            .catch(this.onListDirError.bind(this));
                        }

                    })


            }
        }
    }

    maybeLoadMore() {

        if (this.state.next_page > -1 &&
            this.state.loading === false &&
            this.state.loaded === true) {

            this.setState({'loading': false},
                () => {

                    fsSearch(this.state.root,
                         this.state.path,
                         this.state.active_query, this.state.next_page, 25)
                    .then(this.onSearchSuccess.bind(this))
                    .catch(this.onListDirError.bind(this));

                })

        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location != this.props.location) {
            this.maybefetchContent()
        }
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

    onSearchSuccess(response) {
        // validate that the current state matches the expected state
        // when the function was fired
        const obj = response.data.result

        // obj.name == current root
        // obj.parent == string representing parent path
        // obj.path == string representing this path

        const items = []

        for (var i=0; i < obj.files.length; i++) {
            items.push({...obj.files[i], isDir: false})
        }

        var next_page = -1
        var directoryItems = []

        var next_state = {
            loading: false,
            loaded: true
        }

        if (items.length == 0) {
            // there is no more content to display
            next_state['next_page'] = -1
        }
        else if (this.state.next_page === -1) {
            // this is the first page of items
            next_state['next_page'] = 1
            next_state['directoryItems'] = items
        }
        else {
            // this is new content to append
            next_state['next_page'] = this.state.next_page + 1
            next_state['directoryItems'] = this.state.directoryItems.concat(items)
        }

        // an incomplete page was returned
        if (items.length < 25) {
            next_state['next_page'] = -1
        }

        console.log(
            "result count: " + items.length +
            " current page: " + this.state.next_page +
            " -> " + next_state['next_page'])

        this.setState(next_state)
    }

    rootKeyExtractor = (item, index) => item;

    rootRenderItem = ({item, index}) => (
        <ListItemC
            data={{name:item.text, isDir:true}}
            onPress={(_) => {this.rootOnPress(item)}}
        ></ListItemC>
    );

    rootOnPress = (data) => {
        this.props.pushLocation('/u/storage/' + data.name)
    };

    itemKeyExtractor = (item, index) => item.name;

    itemRenderItem = ({item, index}) => (
        <ListItemC
            index={index}
            root={this.state.root}
            path={this.state.path}
            data={item}
            dataPath={(this.state.active_query!==null)?item.file_path:null}
            onPress={this.itemOnPress}
        ></ListItemC>
    );

    itemOnPress = (data, dataPath) => {

        if (data === null) {

            var url = '/u/storage/' + dataPath

            this.setState({active_query: null, loaded: false},
                () => {
                    this.props.pushLocation(url)
                    // force a reload when the url is not going to change
                    if (this.props.location == url) {
                        this.maybefetchContent()
                    }
                })


        } else if (data.isDir) {
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
            this.props.pushLocation('/u/storage')

        } else {
            const url = '/u/storage/' + this.state.root + "/" + this.state.parentPath
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
        this.setState({showDialog: false})
    }

    search() {

        var parts = this.state.query.split(/\s/).filter(p => p.length > 1)

        if (parts.length > 0) {
            var new_state = {active_query: parts, loaded: false}
            this.setState(new_state,
                () => {this.maybefetchContent()})
        }


    }

    clear_search() {

        var new_state = {active_query: null, loaded: false}
        this.setState(new_state,
            () => {this.maybefetchContent()})

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

            const bar_height = 96 // this.state.editDialogVisible?128:96

            return (

                <View>


                <View style={{
                    borderBottomWidth: 1,
                    position: 'fixed',
                    backgroundColor: 'white',
                    top: 100,
                    height: bar_height,
                    zIndex: 10,
                    width: '100%'}}>


                    <Text style={{margin: 4}}>
                    {'/' + this.state.path}
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={{marginRight: 5}}
                            onPress={() => {this.goBack()}}>
                            <Text style={{padding: 10}}>Back</Text>
                        </TouchableOpacity>
                        {this.state.active_query?null:
                            <TouchableOpacity
                                style={{marginRight: 5}}
                                onPress={() => {this.onUploadClicked()}}>
                                <Text style={{padding: 10}}>Upload</Text>
                            </TouchableOpacity>}
                        {this.state.active_query?null:
                            <TouchableOpacity
                                style={{marginRight: 5}}
                                onPress={() => {
                                this.setState({editDialogVisible: !this.state.editDialogVisible});
                                }}>
                                <Text style={{padding: 10}}>New Directory</Text>
                            </TouchableOpacity>}

                    </View>


                    <FadeInView
                      visible={this.state.editDialogVisible}
                      complete={() => {this.newFolderInput && this.newFolderInput.focus()}}>

                      <View>
                        <View style={[styles.listItemRow, {justifyContent: 'space-between'}]}>


                          <View style={[styles.listItemRow, {justifyContent: 'space-between', flexGrow: 1}]}>
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

                          <TextInput
                            ref={(input) => {this.newFolderInput = input}}
                            placeholder="New Folder"
                            style={{padding: 5, margin: 5, borderWidth: 1, borderColor: 'black', flexGrow: 1}}
                            onChangeText={(text) => {this.setState({newFolderName: text})}} />

                          </View>

                        </View>
                      </View>
                    </FadeInView>

                    {/*
                        TODO: hide this view when the create direc
                    */}
                    <FadeInView
                      visible={!this.state.editDialogVisible}
                      >
                    <View style={styles.buttonContainer}>

                        <TouchableOpacity onPress={() => {this.search()}}>
                            <Text style={{padding: 0, margin: 10}}>Search</Text>
                        </TouchableOpacity>
                        {(this.state.active_query !== null)?
                            <TouchableOpacity onPress={() => {this.clear_search()}}>
                                <Text style={{padding: 0, margin: 10}}>Clear</Text>
                            </TouchableOpacity>: null}

                        <TextInput
                            placeholder="Search Directory"
                            style={{borderWidth: 1, borderColor: '#000000', width: 100, margin: 5, flexGrow: 1}}
                            onChangeText={(query) => this.setState({query})}
                        />


                    </View>
                    </FadeInView>


                </View>

                <View>

                <View style={{
                    backgroundColor: 'white',
                    height: bar_height,
                    width: '100%'}}>
                </View>

                <View>
                    {Object.keys(this.state.uploadFiles).sort(sortStrings).map(
                        (item, index) => {
                            const obj = this.state.uploadFiles[item]
                            const pct = obj.finished? 100 : (obj.bytesTransfered / obj.fileSize * 100).toFixed(0)
                            return <Text style={{backgroundColor: "#00FF0055", margin: 5}}>Uploading {obj.fileName} ... {pct} % </Text>
                        }
                    )}
                </View>

                {this.state.loading?<Text>loading...</Text>:
                    <FlatList
                        data={this.state.directoryItems}
                        extraData={this.state}
                        keyExtractor={this.itemKeyExtractor}
                        renderItem={this.itemRenderItem.bind(this)}
                        ListFooterComponent={ListFooter}
                        onEndReached={this.maybeLoadMore.bind(this)}
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

export default connect(mapStateToProps, bindActions)(StoragePage);