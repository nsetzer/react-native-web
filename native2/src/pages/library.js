

import React from 'react';
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { connect } from "react-redux";

import { env, librarySearch, authenticate, downloadFile, dirs, authConfig } from '../common/api';
import { setConfig } from '../config';

import ForestView from '../common/components/ForestView';

import TrackPlayer from 'react-native-track-player';

import CheckBox from '../common/components/CheckBox'

function trim(s)
{
    return String(s).replace(/^\s+|\s+$/g, '');
};


// TODO: filter songs by
//   - valid is set
//   - synced is true if 'local only' is set
//   - otherwise streaming of music is possible

export class LibraryPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            db: null,
            data: {},     // search results formatted for a forest
            raw_data: {}, // search results

            includeRemote: false,
            searchText: "",
        }
    }

    search() {
        this._search().then(
            (result) => {console.log("search complete")},
            (error) => {console.error(error)}
        )
    }

    async _search() {

        var items = this.state.searchText.split().map(s => trim(s)).filter(s => s);
        var cols = ['artist', 'album', 'title', 'comment']

        var rule = items.map(s => ('(' + cols.map(c => (c + ' LIKE ?')).join(' OR ') + ')')).join(' AND ')
        var params = []
        for (var i=0; i < items.length; i++) {
            for (var j=0; j < cols.length; j++) {
                params.push('%' + items[i] + '%')
            }
        }

        var clause
        if (this.state.includeRemote) {
            if (items.length > 0) {
                clause = "WHERE (" + rule + ")"
            } else {
                clause = ""
            }
        } else {
            if (items.length > 0) {
                clause = "WHERE (synced == 1 AND (" + rule + "))"
            } else {
                clause = "WHERE (synced == 1)"
            }
        }

        console.log(clause)

        var cols_select = "uid, synced, artist, artist_key, album, title, file_path, art_path, length"
        result = await this.props.db.execute("SELECT " + cols_select + " FROM songs " +
            clause + " ORDER BY artist_key, album, title ASC", params)

        data = {}
        raw_data = {}
        for (var i=0; i < result.rows.length; i++) {
            var item = result.rows.item(i);

            raw_data[item.uid] = item

            if (data[item.artist] === undefined) {
                data[item.artist] = {}
            }

            if (data[item.artist][item.album] === undefined) {
                data[item.artist][item.album] = []
            }

            data[item.artist][item.album].push(item)

        }

        /*
        data = []
        raw_data = {}
        var nextId = 0
        var previousArtist = null;
        var previousAlbum = null;
        var albumParentIndex = -1
        var songParentIndex = -1

        for (var i=0; i < result.rows.length; i++) {
            var item = result.rows.item(i);

            raw_data[item.uid] = item

            if (item.artist != previousArtist) {
                previousArtist = item.artist
                data.push(this.refs.forest.createNode(nextId.toString(), null, 0, item.artist, null))
                albumParentIndex = data.length - 1
                nextId += 1

                previousAlbum = item.album
                data.push(this.refs.forest.createNode(nextId.toString(), null, 1, item.album, albumParentIndex))
                songParentIndex = data.length - 1
                nextId += 1

                data[albumParentIndex].addChildIndex(songParentIndex)

            } else if (item.album != previousAlbum) {

                previousAlbum = item.album
                data.push(this.refs.forest.createNode(nextId.toString(), null, 1, item.album, albumParentIndex))
                songParentIndex = data.length - 1
                nextId += 1

                data[albumParentIndex].addChildIndex(songParentIndex)
            }


            data.push(this.refs.forest.createNode(item.uid, item, 2, item.title, songParentIndex))
            data[songParentIndex].addChildIndex(data.length - 1)

        }

        */

        this.setState({data, raw_data})
    }

    create() {
        this._create().then(
            (result) => {},
            (error) => {console.error(error)}
        )
    }

    async _create() {

        var selected = await this.refs.forest.getSelection()

        if (selected.length < 1) {
            // TODO: alert user
            return
        }

        console.log("create playlist")

        setConfig()
        var cfg = authConfig()
        const response = await authenticate(cfg.auth.username, cfg.auth.password)
        var token = response.data.token

        console.log("create playlist")

        console.log("create playlist: " + selected.length)

        var tracks = selected.map((song => this._create_track(song, token)))

        console.log("create playlist: " + tracks.length)

        for (var i=0; i < tracks.length; i++ ) {
            console.log("track2: " + i + " - " + tracks[i].url)
        }

        console.log(tracks)


        await TrackPlayer.reset()
        await TrackPlayer.add(tracks);
        await TrackPlayer.play();

        await TrackPlayer.updateOptions({
            stopWithApp: false,
        })
    }

    _create_track(song, token) {
            var track = {
                id: song.uid,
                title: song.title,
                artist: song.artist,
                album: song.album,
                duration: song.length,
                //artwork: ''
            }

            console.log("track1: " + track.title)

            if (song.synced) {
                track.url = song.file_path
            } else {
                // Utils.java inside track-player is responsible
                // for converting a url, it does not seem to fully
                // support extended URIs, with header support
                track.url = env.baseUrl + "/api/library/" + song.uid + "/audio?token=" + token
            }

            console.log("track1: " + track.url)

            return track
    }

    expandToggle() {
        this.refs.forest.expandToggle().then(
            (result) => {console.log("expand complete")},
            (error) => {console.error(error)}
        )
    }

    selectToggle() {
        this.refs.forest.selectToggle().then(
            (result) => {console.log("select complete")},
            (error) => {console.error(error)}
        )
    }

    render() {

        if (!this.props.db) {
            return (<Text>error loading db</Text>)
        }

        return (
            <View style={{
                flex:1,
                alignItems:'center',
                justifyContent: 'center',
                height:'100%'
            }}>
                <View style={{
                    flex:1,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>


                <TextInput
                    ref='editSearch'
                    style={{flexGrow: 1, borderWidth: 1, borderColor: 'black'}}
                    onChangeText={(text) => this.setState({searchText: text})}
                    onSubmitEditing={() => {this.search()}}
                    />

                <TouchableOpacity onPress={() => {this.search()}}>
                    <Text style={{padding: 5}}>Search</Text>
                </TouchableOpacity>

                <CheckBox
                    style={{paddingRight: 5}}
                    onClick={()=>{this.setState({includeRemote: !this.state.includeRemote})}}
                    isChecked={this.state.includeRemote}
                />
                </View>

                <View style={{
                        flex:1,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                    <TouchableOpacity onPress={() => {this.create()}}>
                        <Text style={{padding: 5}}>create</Text>
                    </TouchableOpacity>

                </View>
                <ForestView ref='forest' data={this.state.data}/>

            </View>
        );
    }
}

const mapStateToProps = state => ({
    db: state.sqldb.db,
});

const bindActions = dispatch => ({
});

export default connect(mapStateToProps, bindActions)(LibraryPage);
