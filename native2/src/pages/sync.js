


/*

on sync pressed -> show message and when complete clear message start download
hide sync button until changes have been made
    a new search resets the state

*/
import React from 'react';
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { connect } from "react-redux";

import { env, librarySearch, authenticate } from '../common/api';
import { setConfig } from '../config';
import ForestView from '../common/components/ForestView';

import { syncInitAction } from './download'


import TrackPlayer from 'react-native-track-player';

function hashString(s) {
  var hash = 0, i, chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr   = s.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function hashInt(v) {
    return v|0
}

function hashFloat(v) {
    return 0 // not implemented
}

function hashArray(a) {
}

function hashMap(m) {
}

function hashSchema(schema) {
    return hashArray(schema)
}

function trim(s)
{
    return String(s).replace(/^\s+|\s+$/g, '');
};
/*
    unused columns from librarySearch API
    art_path: should not be in response
    banished:
    blocked:
    domain_id:
    equalizer: not useful
    file_path: should not be in response
    file_size: not useful
    frequency: not useful
*/

function remoteSongToLocalSong(song) {

    return {
        uid: song.id,
        user_id: song.user_id,

        artist: song.artist,
        artist_key: song.artist_key,
        album: song.album,
        title: song.title,
        composer: song.composer,
        comment: song.comment,
        country: song.country,
        language: song.language,
        genre: song.genre,

        play_count: song.play_count,
        skip_count: song.skip_count,
        year: song.year,
        length: song.length,
        rating: song.rating,

        date_added: song.date_added,
        last_played: song.last_played,
        valid: 1
    }
}

export class SyncPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            db: null,
            data: {},     // search results formatted for a forest
            raw_data: {}, // search results
            defaultSelected: {},
            searchText: "",
        }
    }

    insertRow() {

        this._insertRow().then(
            (result) => {console.log(result)},
            (error) => {console.error(error)}
        )

    }

    async _insertRow() {

        var song1 = {
            uid: "123",
            artist: "123",
            title: "123",
            album: "123",
            user_id: "000"
        }
        var song2 = {
            uid: "124",
            artist: "123",
            title: "123",
            album: "123",
            user_id: "000"
        }

        var result = null;
        result = await this.props.db.t.songs.insert(song1);
        var spk = result.insertId
        //result = await this.props.db.t.songs.insert_bulk([song1, song2]);
        console.log(Object.keys(result))
        console.log(result)
        for (var i=0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            console.log(item)
        }

        result = await this.props.db.t.songs.count()
        console.log(result)

        result = await this.props.db.execute("SELECT * from songs", [])
        console.log(Object.keys(result))
        console.log(result)
        for (var i=0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            console.log(item)
        }

        result = await this.props.db.t.songs.update(spk, {artist: "256"});
        console.log(Object.keys(result))
        console.log(result)
        for (var i=0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            console.log(item)
        }

        result = await this.props.db.execute("SELECT * from songs", [])
        console.log(Object.keys(result))
        console.log(result)
        for (var i=0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            console.log(item)
        }

        result = await this.props.db.t.songs.upsert({uid: "123"}, {"title": 'upsert'})
        console.log(Object.keys(result))
        console.log(result)
        for (var i=0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            console.log(item)
        }

        result = await this.props.db.execute("SELECT * from songs", [])
        console.log(Object.keys(result))
        console.log(result)
        for (var i=0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            console.log(item)
        }

    }

    fetchData() {

        setConfig()

        this._fetchDataV3().then(
            (result) => {console.log("fetch complete")},
            (error) => {console.error(error)}
        )
    }

    async _fetchDataV1() {

        var timeit = () => (new Date().getTime())

        var t0 =timeit();

        var fetch_size = 500
        var response = await librarySearch("", fetch_size, 0, 'forest')
        var songs = response.data.result.map((s) => remoteSongToLocalSong(s))

        var t1 =timeit();

        for (var i=0; i < songs.length; i++) {
            await this.props.db.t.songs.upsert({uid: song.uid}, song)
        }

        var t2 = timeit();

        console.log("total: " + (t2 - t0) + " request: " + (t1 - t0) + " insert: " + (t2 - t1))
        return

    }

    async _fetchDataV2() {

        var timeit = () => (new Date().getTime())

        var t0 =timeit();

        var fetch_size = 800
        var response = await librarySearch("", fetch_size, 0, 'artist')
        // convert the set of songs from the response
        var songs = response.data.result.map((s) => remoteSongToLocalSong(s))

        var t1 =timeit();

        // determine which UIDs actually exist in the current database
        song_uids = {uid: songs.map((s) => s.uid)}
        var result = await this.props.db.t.songs.exists_batch(song_uids)
        console.log(result)
        var exists = {}
        for (var i=0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            exists[item.uid] = item.spk
        }

        // prepare insert of update statements
        var statements = []
        var spk
        for (var i=0; i < songs.length; i++) {
            spk = exists[songs[i].uid]
            if (!!spk) {
                statements.push(this.props.db.t.songs.prepare_update(spk, songs[i]))
            } else {
                statements.push(this.props.db.t.songs.prepare_insert(songs[i]))
            }
        }

        // execute the insert/update as a single batch
        await this.props.db.execute_batch(statements)

        var t2 = timeit();

        console.log("nsongs: " + (songs.length) + " / " + (response.data.result.length) + " total: " + (t2 - t0) + " request: " + (t1 - t0) + " insert: " + (t2 - t1))
        return
    }

    async _fetchDataV3() {

        var timeit = () => (new Date().getTime())

        // there is a natural limit of 999 sql parameters
        // batch_size is intentionally set under this limit
        var fetch_size = 2700 // TODO: invesitgate increasing size
        var batch_size = 900

        var t0, t1, t2, ts, te
        var response, songs
        var i,j,l
        var params, exists, result
        var spk, statements

        result = await this.props.db.execute("UPDATE songs SET valid = 0", [])

        result = await this.props.db.execute("SELECT spk, uid FROM songs", [])
        exists = {}
        for (var j=0; j < result.rows.length; j++) {
            var item = result.rows.item(j);
            exists[item.uid] = item.spk
        }

        ts = timeit();
        for (var page=0; page < 60; page++) {

            t0 = timeit();
            response = await librarySearch("", fetch_size, page, 'forest')

            if (response.data.result.length == 0) {
                break;
            }

            // convert the set of songs from the response
            songs = response.data.result.map((s) => remoteSongToLocalSong(s))

            t1 =timeit();

            l = songs.length

            for (i=0; i < l; i += batch_size) {
                params = []
                for (j=i; j < i + batch_size && j < l; j++) {
                    params.push(songs[j].uid)
                }

                statements = []
                for (j=i; j < i + batch_size && j < l; j++) {
                    spk = exists[songs[j].uid]
                    if (!!spk) {
                        statements.push(this.props.db.t.songs.prepare_update(spk, songs[j]))
                    } else {
                        statements.push(this.props.db.t.songs.prepare_insert(songs[j]))
                    }
                }

                await this.props.db.execute_batch(statements)
            }

            t2 = timeit();

            console.log("nsongs: " + (songs.length) +
                        " total: " + (t2 - t0) +
                        " request: " + (t1 - t0) +
                        " insert: " + (t2 - t1))
        }
        te = timeit();
        console.log("total time: " + (te - ts))
        return
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
        if (items.length > 0) {
            clause = "WHERE (" + rule + ")"
        } else {
            clause = ""
        }

        console.log(clause)

        var cols_select = "uid, artist, album, title, sync, synced"
        var result = await this.props.db.execute("SELECT " + cols_select + " FROM songs " +
            clause + " ORDER BY artist_key, album, title ASC", params)

        data = {}
        raw_data = {}
        selected = {}
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

            if (!!item.sync) {
                selected[item.uid] = true
            }

        }

        this.setState({data, raw_data, defaultSelected: selected})
    }

    startSync() {
        this._doSync().then(
            (result) => {console.log("sync complete")},
            (error) => {console.error(error)}
        )
    }

    async _doSync() {

        var selected = await this.refs.forest.getSelection()

        var items = {...this.state.raw_data}

        var update_items = {}

        selected.map((item) => {
            delete items[item.uid];

            if (!item.sync) {
                update_items[item.uid] = true
                item.sync = true
            }
        })

        var keys = Object.keys(items)

        Object.keys(items).map((key) => {
            var item = items[key]

            if (!!item.sync) {
                update_items[item.uid] = false
                item.sync = false
            }
        })

        console.log(update_items)

        var key;
        var keys = Object.keys(update_items)
        for (var i=0; i < keys.length; i++) {
            key = keys[i]

            await this.props.db.t.songs.update({uid: key}, {sync: update_items[key]})

        }

        this.props.syncInitAction()
    }

    startDownload() {
        this.props.syncInitAction()
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

        //<TouchableOpacity onPress={() => {this.insertRow()}}>
        //    <Text style={{padding: 5}}>Insert</Text>
        //</TouchableOpacity>

        //<TouchableOpacity onPress={() => {this.expandToggle()}}>
        //    <Text style={{padding: 5}}>Expand All</Text>
        //</TouchableOpacity>

        return (
            <View style={{
                flex:1,
                alignItems:'center',
                justifyContent: 'center',
                height:'100%'
            }}>
                <TextInput
                    ref='editSearch'
                    style={{flexGrow: 1, borderWidth: 1, borderColor: 'black', width: "100%"}}
                    onChangeText={(text) => this.setState({searchText: text})}
                    onSubmitEditing={() => {this.search()}}
                    />

                {!this.props.db?<Text>error loading db</Text>:
                    <View style={{
                        flex:1,
                        flexDirection: 'row',
                    }}>

                    <TouchableOpacity onPress={() => {this.fetchData()}}>
                        <Text style={{padding: 5}}>Fetch</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {this.search()}}>
                        <Text style={{padding: 5}}>Search</Text>
                    </TouchableOpacity>



                    <TouchableOpacity onPress={() => {this.selectToggle()}}>
                        <Text style={{padding: 5}}>Select All</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {this.startSync()}}>
                        <Text style={{padding: 5}}>Sync</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {this.startDownload()}}>
                        <Text style={{padding: 5}}>Download</Text>
                    </TouchableOpacity>

                    </View>
                }

                <ForestView
                    ref='forest'
                    data={this.state.data}
                    selected={this.state.defaultSelected}
                    itemKeyExtractor={(item) => item.uid}
                    highlightMode="row"/>

            </View>
        );
    }
}

const mapStateToProps = state => ({
    db: state.sqldb.db,
});

const bindActions = dispatch => ({
    syncInitAction: () => {dispatch(syncInitAction())},
});

export default connect(mapStateToProps, bindActions)(SyncPage);
