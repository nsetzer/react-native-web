

import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, PermissionsAndroid } from "react-native";
import { connect } from "react-redux";

import { env, librarySearch, authenticate, downloadFile, dirs, authConfig } from '../common/api';
import { setConfig } from '../config';

export const SYNC_INIT_ACTION = "SYNC_INIT_ACTION"
export const SYNC_BEGIN_ACTION = "SYNC_BEGIN_ACTION"
export const SYNC_UPDATE_ACTION = "SYNC_UPDATE_ACTION"
export const SYNC_TERMINATE_ACTION = "SYNC_TERMINATE_ACTION"
export const SYNC_END_ACTION = "SYNC_END_ACTION"

export function syncInitAction() {
    return {
      type: SYNC_INIT_ACTION,
    }
}

export function syncBeginAction(songs) {
    return {
      type: SYNC_BEGIN_ACTION,
      songs: songs
    }
}

export function syncUpdateAction(dlindex) {
    return {
      type: SYNC_UPDATE_ACTION,
      dlindex: dlindex
    }
}

export function syncTerminateAction(songs) {
    return {
      type: SYNC_TERMINATE_ACTION,
    }
}

export function syncEndAction() {
    return {
      type: SYNC_END_ACTION,
    }
}

const INITIAL_STATE = {
    isDownloading: false,
    dlsongs: null,  // metadata for tracks to download
    dlindex: 0,     // index into dlsongs
    dlcount: 0,     // total count of files to sync, dlsongs.length
    dlalive: true,  // set false to terminate sync
}

export function syncReducer(state = INITIAL_STATE, action = {}) {
    switch(action.type) {

        case SYNC_INIT_ACTION:
            return {
                isDownloading: true,
                dlsongs: null,
                dlindex: 0,
                dlcount: 0,
                dlalive: false,
            }
        case SYNC_BEGIN_ACTION:
            return {
                isDownloading: (action.songs.length > 0),
                dlsongs: action.songs,
                dlindex: 0,
                dlcount: action.songs.length,
                dlalive: true,
            }

        case SYNC_UPDATE_ACTION:
            return {
                ...state,
                dlindex: action.dlindex,
            }

        case SYNC_TERMINATE_ACTION:
            return {
                ...state,
                dlalive: action.false,
            }

        case SYNC_END_ACTION:
            return {
                isDownloading: false,
                dlsongs: null,
                dlindex: 0,
                dlcount: 0,
                dlalive: false,
            }

        default:
            return state
    }
}

class IDownloadComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isDownloading: false,
            progress: null,
            dlsongs: null,
            dlindex: 0,
            dlcount: 0,
            dlalive: false,
            dlerror: null,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isDownloading === false && this.props.isDownloading === true) {
            console.log("start download")

            this._doDownloadInit().then(
                (result) => {},
                (error) => {this._downloadComplete(error);}
            )

        }
    }

    // Note: downloading songs is broken into multiple phases
    // the end of each phase calls setState, using the callback
    // to delay the start of the next phase until the state is updated.
    // each phase is separated by when the state needs to be updated

    async requestStoragePermission() {
        try {
            /*
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                title: 'Cool Photo App Camera Permission',
                message:
                    'Cool Photo App needs access to your camera ' +
                    'so you can take awesome pictures.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
                },
            );
            */
            const result = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE])
            console.log(result)

            const granted = result[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.warn(err);
        }
    }

    async _doDownloadInit() {

        var cont = await this.requestStoragePermission()
        if (!cont) {
            return
        }

        // TODO: auth parameters should come from redux store...
        setConfig()
        var cfg = authConfig()
        const response = await authenticate(cfg.auth.username, cfg.auth.password)
        var token = response.data.token

        var result = await this.props.db.execute("SELECT uid, sync, synced, artist, album, title, album_index from songs WHERE sync == 1", [])

        var dlsongs = result.rows.raw().filter(
            item => (item.sync && item.sync != item.synced)
        ).map((item) => this._doDownloadInit_processItem(item, token))

        console.log("download: starting main sequence")
        if (dlsongs.length > 0) {
            console.log("download main...")
            this.setState({dlsongs, dlindex:0, dlcount: dlsongs.length, dlalive: true}, () => {
                this._doDownloadMain().then(
                        (result) => {},
                        (error) => {console.log(error)}
                    )
            })
        } else {
            this.setState({dlerror: "Nothing to do"}, () =>{
                setTimeout(() => {this.setState({dlerror: null},
                           ()=>{this._downloadComplete();})}, 3000)
            })
        }
    }

    _makeSafe(s, remove_space) {
        if (remove_space) {
            s = s.replace(/\s/g, '_')
        }
        // TrackPlayer cannot load tracks with a :
        return s.replace(/[\?\.\:\'\"\\\/\[\]\(\)]/g, '')
    }

    _doDownloadInit_processItem(item, token) {
        var file_index = ((item.album_index!==null)?item.album_index + "_":'')
        var file_suffix = "." + item.uid.substring(0, 8) + ".ogg"
        var file_name = this._makeSafe(item.title, true)
        var file_artist = this._makeSafe(item.artist, false)
        var file_album = this._makeSafe(item.album, false)
        file_name = file_artist + "/" + file_album + "/" + file_name + file_suffix

        var url = env.baseUrl + "/api/library/" + item.uid + "/audio"
        var headers = {'Authorization': token}
        var params = {location:  dirs.MusicDir + "/yue/" + file_name}

        return {
            url, headers, params, metadata: item
        }
    }

    async _doDownloadMain() {

        if (!this.state.dlalive) {
            console.log("download terminate")
            this._downloadComplete();
            return
        }

        var {dlsongs, dlindex} = this.state

        var song = dlsongs[dlindex]

        try {
            var f_obj = await this._doDownloadOne(song.url, song.params, song.headers)

            var length = f_obj.info().headers['Content-Length']

            var npk = {uid: song.metadata.uid}
            var record = {
                synced: true,
                file_path: song.params.location,
                file_size: (length>0)?length:null,
            }

            console.log(record)

            await this.props.db.t.songs.update(npk, record)

        } catch (error) {
            console.log(song)
            console.log(error)
        }

        dlindex+=1
        if (dlindex < dlsongs.length) {
            this.setState({dlindex}, () => {
                this._doDownloadMain().then(
                        (result) => {},
                        (error) => {console.log(error)}
                    )
            })
        } else {
            this._downloadComplete();
        }
    }

    async _doDownloadOne(url, params, headers) {
        return await new Promise((resolve, reject) => {
            downloadFile(url, headers, params,
                resolve, reject, (progress) => {
                    this.setState({progress})
                })
        })
    }

    _downloadComplete(error) {
        this.setState({dlsongs: null, dlindex:0, dlcount: 0, dlalive: false}, () => {
            this.props.syncEndAction();
            console.log("download complete")
            if (error) {
                console.log(error)
            }
        })
    }

    render() {


        if (!this.props.isDownloading) {
            return null
        }

        var remaining = 0
        var song = null
        if (this.state.dlindex >= 0 && this.state.dlindex < this.state.dlcount) {
            remaining = this.state.dlcount - this.state.dlindex
            song = this.state.dlsongs[this.state.dlindex].metadata
        }

        if (this.state.dlerror !== null) {
            return (
                <View>
                <View>
                <Text>{this.state.dlerror}</Text>
                </View>
                </View>
            )
        }

        return (
            <View>
            <View>

            {this.state.dlalive?
                <TouchableOpacity onPress={() => {this.setState({dlalive: false})}}>
                    <Text style={{padding: 5}}>Stop Download</Text>
                </TouchableOpacity>:
                <Text style={{padding: 5}}>{(this.state.dlcount===0)?"Starting Download...":"Stopping Download..."}</Text>}

            {this.state.dlcount>0?
                <Text>{remaining}: {
                    this.state.dlsongs[this.state.dlindex].metadata.artist} - {
                    this.state.dlsongs[this.state.dlindex].metadata.title} - {
                    this.state.progress?(Math.round(100*this.state.progress.bytesTransfered/this.state.progress.fileSize)):0}%</Text>:null}

            </View>
            </View>
        )
    }

}

const mapStateToProps = state => ({
    db: state.sqldb.db,
    isDownloading: state.sync.isDownloading,
    dlsongs: state.sync.dlsongs,
    dlindex: state.sync.dlindex,
    dlcount: state.sync.dlcount,
    dlalive: state.sync.dlalive,
});

const bindActions = dispatch => ({
    syncBeginAction: (songs) => {dispatch(syncBeginAction(songs))},
    syncUpdateAction: (dlindex) => {dispatch(syncUpdateAction(dlindex))},
    syncTerminateAction: () => {dispatch(syncTerminateAction())},
    syncEndAction: () => {dispatch(syncEndAction())},
});

export const DownloadComponent = connect(mapStateToProps, bindActions)(IDownloadComponent);


