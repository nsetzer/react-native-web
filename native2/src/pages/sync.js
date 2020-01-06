


/*

on sync pressed -> show message and when complete clear message start download
hide sync button until changes have been made
    a new search resets the state

*/
import React from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { connect } from "react-redux";

import { env, librarySearch, authenticate } from '../common/api';
import { setConfig } from '../config';
import ForestView from '../common/components/ForestView';

import { syncInitAction } from './download'
import { fetchInitAction } from './fetch'

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
        console.log("begin fetch data")
        this.props.fetchInitAction()
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
                // update local cache
                item.sync = false
                item.synced = false
            }
        })

        console.log(update_items)

        var key;
        var keys = Object.keys(update_items)
        for (var i=0; i < keys.length; i++) {
            key = keys[i]

            var _key = {uid: key}
            var _val = {sync: update_items[key]}
            // TODO: another process should search for
            // sync == false, synced==true and delete the files
            // and then clear the synced flag. for now this
            // is being done to force a re download
            if (!_val.sync) {
                _val.synced = false
            }
            await this.props.db.t.songs.update(_key, _val)

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
            <ScrollView stickyHeaderIndices={[0]}>

                <View style={{width: "100%", backgroundColor: "white"}}>
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

                        <TouchableOpacity style={{margin: 5}} onPress={() => {this.fetchData()}}>
                            <Text style={{padding: 8, backgroundColor: "#3333AA33"}}>Fetch</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{margin: 5}} onPress={() => {this.search()}}>
                            <Text style={{padding: 8, backgroundColor: "#3333AA33"}}>Search</Text>
                        </TouchableOpacity>



                        <TouchableOpacity style={{margin: 5}} onPress={() => {this.selectToggle()}}>
                            <Text style={{padding: 8, backgroundColor: "#3333AA33"}}>Select All</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{margin: 5}} onPress={() => {this.startSync()}}>
                            <Text style={{padding: 8, backgroundColor: "#3333AA33"}}>Sync</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{margin: 5}} onPress={() => {this.startDownload()}}>
                            <Text style={{padding: 8, backgroundColor: "#3333AA33"}}>Download</Text>
                        </TouchableOpacity>

                        </View>
                    }
                </View>

                <ForestView
                    ref='forest'
                    data={this.state.data}
                    selected={this.state.defaultSelected}
                    itemKeyExtractor={(item) => item.uid}
                    highlightMode="row"/>

            </ScrollView>
        );
    }
}

const mapStateToProps = state => ({
    db: state.sqldb.db,
});

const bindActions = dispatch => ({
    syncInitAction: () => {dispatch(syncInitAction())},
    fetchInitAction: () => {dispatch(fetchInitAction())},
});

export default connect(mapStateToProps, bindActions)(SyncPage);
