

import React from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { connect } from "react-redux";

import { env, librarySearch, authenticate, downloadFile, dirs, authConfig } from '../common/api';
import { setConfig } from '../config';

import ForestView from '../common/components/ForestView';
import {fisheryates} from '../common/shuffle';

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

            moreData: null,

            token: null,
        }
    }

    componentWillMount() {

        if (this.props.db !== null) {
            this.search()
        }

        setConfig()
        var cfg = authConfig()
        authenticate(cfg.auth.username, cfg.auth.password).then(
            (response) => {this.setState({token: response.data.token})},
            (error) => {this.setState({token: null})},
        );

    }

    /*
    // TODO: on initial load run search
    componentDidUpdate(prevProps, prevState) {

        if (prevProps.db != prevState.db) {
            console.log("setting database")
            this.setState({
                db: prevProps.db,
            }, () => {
                if (prevProps.db !== null) {
                    this.search()
                }
            })
        }
    }
    */

    search() {
        this._search().then(
            (result) => {console.log("search complete")},
            (error) => {console.error(error)}
        )
    }

    async _search() {

        console.log("search term: (" + this.state.searchText + ")")
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

        await this.async_search_main(clause, params)

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

    }

    async async_search_main(clause, params) {

        var cols_select = "uid, synced, artist, artist_key, album, title, genre, file_path, art_path, length, rating, language"

        var statement = "SELECT " + cols_select + " FROM songs " +
            clause + " ORDER BY artist_key, album, title ASC"

        console.log(statement)

        result = await this.props.db.execute(statement, params)

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

        console.log("create playlist: " + selected.length)

        var tracks = fisheryates(selected.map((song => this._create_track(song, this.state.token))))

        console.log("create playlist: " + tracks.length)

        await TrackPlayer.reset()
        await TrackPlayer.add(tracks);
        await TrackPlayer.play();

        await TrackPlayer.updateOptions({
            stopWithApp: false,
        })

        await this.refs.forest.clearSelection()
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

            if (song.synced) {
                track.url = song.file_path
            } else {
                // Utils.java inside track-player is responsible
                // for converting a url, it does not seem to fully
                // support extended URIs, with header support
                track.url = env.baseUrl + "/api/library/" + song.uid + "/audio?token=" + token
            }

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

    dynSearch(rule, params) {
        this._dynSearch(rule, params).then(
            (result) => {console.log("search complete")},
            (error) => {console.error(error)}
        )
    }

    async _dynSearch(rule, params) {

        var clause
        if (this.state.includeRemote) {
            clause = "WHERE (" + rule + ")"
        } else {
            clause = "WHERE (synced == 1 AND (" + rule + "))"
        }

        await this.async_search_main(clause, params)
    }

    onMorePressed(data) {

        this.setState({moreData: data})
    }

    onMorePlayNext() {

        var item = this.state.moreData
        this.setState({moreData: null}, () => {
            TrackPlayer.getQueue().then(
                (queue) => {
                    TrackPlayer.getCurrentTrack().then(
                        (track) => {
                            this._insertAfter(queue, track, item)
                        }
                    );
                }
            );
        })
    }

    _insertAfter(queue, currentTrackId, data, token) {
        // insert a track after the current track
        // remove the track from the queue it it exists
        // before inserting it again
        var idx = -1;
        var rdx = -1;
        for (var i=0; i < queue.length; i++) {
            if (queue[i].id == currentTrackId) {
                idx = i;
            }
            if (queue[i].id == data.uid) {
                rdx = i;
            }
        }

        var nextTrackId = null;
        if (idx >= 0 && idx < (queue.length - 1)) {
            nextTrackId = queue[idx+1].id;
        }

        var track = this._create_track(data, this.state.token)

        if (rdx >= 0 && rdx < queue.length) {
            TrackPlayer.remove(data.uid).then(() => {
                TrackPlayer.add(track, nextTrackId)
            })
        } else {
            TrackPlayer.add(track, nextTrackId)
        }

    }

    render() {

        if (!this.props.db) {
            return (<Text>error loading db</Text>)
        }

        return (

            <ScrollView stickyHeaderIndices={[0]}>
                <View style={{width:"100%", backgroundColor: "white"}}>

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

                        <TouchableOpacity style={{margin: 5}} onPress={() => {this.search()}}>
                            <Text style={{padding: 8, backgroundColor: "#3333AA33"}}>Search</Text>
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
                        <TouchableOpacity style={{margin: 5}} onPress={() => {this.create()}}>
                            <Text style={{padding: 8, backgroundColor: "#3333AA33"}}>create</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{margin: 5}} onPress={() => {this.selectToggle()}}>
                            <Text style={{padding: 8, backgroundColor: "#3333AA33"}}>Select All</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{margin: 5}} onPress={() => {
                            this.dynSearch("rating > ? AND language LIKE ?", [5, '%english%'])}}>
                            <Text style={{padding: 8, backgroundColor: "#3333AA33"}}>en_best</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{margin: 5}} onPress={() => {
                            this.dynSearch("rating > ? AND genre LIKE ?", [3, '%stoner%'])}}>
                            <Text style={{padding: 8, backgroundColor: "#3333AA33"}}>st_best</Text>
                        </TouchableOpacity>

                    </View>

                    {this.state.moreData===null?null:
                        <View>
                            <TouchableOpacity style={{margin: 5}} onPress={this.onMorePlayNext.bind(this)}>
                                <Text style={{padding: 8, backgroundColor: "#3333AA33"}}>Play Next</Text>
                            </TouchableOpacity>
                        </View>
                    }

                </View>

                <ForestView
                    ref='forest'
                    data={this.state.data}
                    onMorePressed={this.onMorePressed.bind(this)}
                    />

            </ScrollView>
        );
    }
}

const mapStateToProps = state => ({
    db: state.sqldb.db,
});

const bindActions = dispatch => ({
});

export default connect(mapStateToProps, bindActions)(LibraryPage);
