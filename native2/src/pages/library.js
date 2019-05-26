

import React from 'react';
import { Text, View, TouchableOpacity, PermissionsAndroid } from "react-native";
import { connect } from "react-redux";

import { env, librarySearch, authenticate, downloadFile, dirs } from '../common/api';
import ForestView from '../common/components/ForestView';

import TrackPlayer from 'react-native-track-player';

export class LibraryPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            db: null,
            data: {},     // search results formatted for a forest
            raw_data: {}, // search results
        }
    }

    search() {
        this._search().then(
            (result) => {console.log("search complete")},
            (error) => {console.error(error)}
        )
    }

    async _search() {

        result = await this.props.db.execute("SELECT uid, artist, album, title, file_path, art_path, length from songs WHERE synced == 1 ORDER BY artist_key, album, title ASC", [])

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

    play() {
        this._play().then(
            (result) => {console.log("sync complete")},
            (error) => {console.error(error)}
        )
    }

    async _play() {

        var result = await this.props.db.execute("SELECT uid, artist, album, title, file_path, art_path, length from songs WHERE synced == 1 LIMIT 1", [])

        if (result.rows.length < 0) {
            return
        }

        var track = result.rows.item(0)

        //await TrackPlayer.setupPlayer({})

        /*
        TrackPlayer.addEventListener("remote-play", () => {console.log("on play")})

        TrackPlayer.addEventListener("remote-pause", () => {console.log("on pause")})
        TrackPlayer.addEventListener("remote-stop", () => {console.log("on stop")})
        //"remote-skip", (track_id) => {}
        TrackPlayer.addEventListener("remote-next", () => {console.log("on next")})
        TrackPlayer.addEventListener("remote-previous", () => {console.log("on prev")})
        // paused/ducking set to true: pause
        // permanent set to true: stop
        // if all 3 are false reset to original state
        TrackPlayer.addEventListener("remote-duck", (paused, permanent, ducking) => {console.log("on duck")})

        TrackPlayer.addEventListener("playback-state", (state) => {console.log("on new state:" + state)})
        TrackPlayer.addEventListener("playback-queue-ended", (track, position) => {console.log("on queue end")})
        TrackPlayer.addEventListener("playback-error", (error, message) => {console.log("on error: " + message)})
        */
        console.log(track)

        // Adds a track to the queue
        await TrackPlayer.add({
            id: track.uid,
            url: track.file_path,
            title: track.title,
            artist: track.artist,
            album: track.album,
            duration: track.length,
            //artwork: ''
        });

        // Starts playing it
        TrackPlayer.play();
    }

    pause() {
        this._pause().then(
            (result) => {console.log("sync complete")},
            (error) => {console.error(error)}
        )
    }

    async _pause() {

        TrackPlayer.pause();
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

        return (
            <View style={{
                flex:1,
                alignItems:'center',
                justifyContent: 'center',
                height:'100%'
            }}>
                {(!this.props.db)?<Text>error loading db</Text>:
                    <View style={{
                        flex:1,
                        flexDirection: 'row',
                    }}>

                    <TouchableOpacity onPress={() => {this.search()}}>
                        <Text style={{padding: 5}}>Search</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {this.play()}}>
                        <Text style={{padding: 5}}>play</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {this.pause()}}>
                        <Text style={{padding: 5}}>pause</Text>
                    </TouchableOpacity>

                    </View>
                }
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
