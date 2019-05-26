

import React from 'react';
import { Text, View, TouchableOpacity, PermissionsAndroid } from "react-native";
import { connect } from "react-redux";

import { dbinit } from '../db';
import { env, librarySearch, authenticate, downloadFile, dirs } from '../common/api';
import ForestView from '../common/components/ForestView';

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
    }
}

const dbSchema = [
    {
        name: 'users',
        columns: [
            {name: "spk",        type: "INTEGER PRIMARY KEY AUTOINCREMENT", },
            {name: "uid",        type: "VARCHAR", },
            {name: "username",   type: "VARCHAR", },
            {name: "apikey",     type: "VARCHAR", },
        ]
    },
    {
        name: 'songs',
        columns: [
            {name: "spk",        type: "INTEGER PRIMARY KEY AUTOINCREMENT", },
            {name: "uid",        type: "VARCHAR UNIQUE", },
            {name: "user_id",    type: "VARCHAR NOT NULL", },

            {name: "sync",       type: "INTEGER DEFAULT 0", }, // download this resource
            {name: "synced",     type: "INTEGER DEFAULT 0", }, // resource has been downloaded

            {name: "artist",     type: "VARCHAR NOT NULL", },
            {name: "artist_key", type: "VARCHAR", },
            {name: "album",      type: "VARCHAR NOT NULL", },
            {name: "title",      type: "VARCHAR NOT NULL", },
            {name: "composer",   type: "VARCHAR", },
            {name: "comment",    type: "VARCHAR", },
            {name: "country",    type: "VARCHAR", },
            {name: "language",   type: "VARCHAR", },
            {name: "genre",      type: "VARCHAR", },

            {name: "file_path",      type: "VARCHAR", },
            {name: "art_path",      type: "VARCHAR", },

            {name: "play_count",  type: "INTEGER DEFAULT 0", },
            {name: "skip_count",  type: "INTEGER DEFAULT 0", },
            {name: "album_index",     type: "INTEGER DEFAULT 0", },
            {name: "year",     type: "INTEGER DEFAULT 0", },
            {name: "length",     type: "INTEGER DEFAULT 0", },
            {name: "rating",     type: "INTEGER DEFAULT 0", },

            {name: "date_added",     type: "INTEGER DEFAULT 0", },
            {name: "last_played",     type: "INTEGER DEFAULT 0", },

        ]
    },
    {
        name: 'history',
        columns: [
            {name: "spk",        type: "INTEGER PRIMARY KEY AUTOINCREMENT", },
            {name: "song_id",       type: "VARCHAR", },
            {name: "user_id",       type: "VARCHAR", },
            {name: "timestamp",     type: "INTEGER", },
        ]
    },
]


export class SyncPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            db: null,
            data: {},     // search results formatted for a forest
            raw_data: {}, // search results
            isDownloading: false,
        }
    }

    componentWillMount() {
        console.log("creating database")

        dbinit({ name: 'yue3.db' }, dbSchema).then(
            (result) => {

                console.log(JSON.stringify(result))
                this.setState({db: result.db})
            },
            (error) => {
                console.log("x error connecting to database")
                console.log(JSON.stringify(error))
                console.error(error)
            }
        );
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
        result = await this.state.db.t.songs.insert(song1);
        var spk = result.insertId
        //result = await this.state.db.t.songs.insert_bulk([song1, song2]);
        console.log(Object.keys(result))
        console.log(result)
        for (var i=0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            console.log(item)
        }

        result = await this.state.db.t.songs.count()
        console.log(result)

        result = await this.state.db.execute("SELECT * from songs", [])
        console.log(Object.keys(result))
        console.log(result)
        for (var i=0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            console.log(item)
        }

        result = await this.state.db.t.songs.update(spk, {artist: "256"});
        console.log(Object.keys(result))
        console.log(result)
        for (var i=0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            console.log(item)
        }

        result = await this.state.db.execute("SELECT * from songs", [])
        console.log(Object.keys(result))
        console.log(result)
        for (var i=0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            console.log(item)
        }

        result = await this.state.db.t.songs.upsert({uid: "123"}, {"title": 'upsert'})
        console.log(Object.keys(result))
        console.log(result)
        for (var i=0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            console.log(item)
        }

        result = await this.state.db.execute("SELECT * from songs", [])
        console.log(Object.keys(result))
        console.log(result)
        for (var i=0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            console.log(item)
        }

    }

    fetchData() {
        this._fetchData().then(
            (result) => {console.log("fetch complete")},
            (error) => {console.error(error)}
        )
    }

    async _fetchData() {

        var response = await librarySearch("", 300, 0, 'forest')
        var songs = response.data.result

        for (var i=0; i < songs.length; i++) {
            var song = remoteSongToLocalSong(songs[i])

            await this.state.db.t.songs.upsert({uid: song.uid}, song)
        }

        var count = await this.state.db.t.songs.count()
        console.log(count)

        return
    }

    search() {
        this._search().then(
            (result) => {console.log("search complete")},
            (error) => {console.error(error)}
        )
    }

    async _search() {

        result = await this.state.db.execute("SELECT uid, artist, album, title, sync, synced from songs ORDER BY artist_key, album, title ASC", [])

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

            await this.state.db.t.songs.update({uid: key}, {sync: update_items[key]})

        }


    }


    startDownload() {

        if (!this.state.isDownloading) {
            this.setState({isDownloading: true})
            this._doDownload().then(
                (result) => {
                    console.log("download complete")
                    this.setState({isDownloading: false})
                },
                (error) => {this.setState({isDownloading: false}); console.log(error)}
            )
        }
    }


    async _doDownload() {

        var cont = await this.requestStoragePermission()
        if (!cont) {
            return
        }

        result = await this.state.db.execute("SELECT uid, sync, synced, artist, album, title, album_index from songs WHERE sync == 1", [])

        var file_name

        const response = await authenticate("admin", "admin")

        var token = response.data.token
        console.log(token)

        for (var i=0; i < result.rows.length; i++) {
            var item = result.rows.item(i);

            if (item.sync && item.sync != item.synced) {

                file_name = item.artist + "/" + item.album + "/" +
                    ((item.album_index!==null)?item.album_index + "_":'') +
                    item.title + "." + item.uid.substring(0, 7) +".ogg"
                file_name = file_name.replace(/\s/g, '_')

                url = env.baseUrl + "/api/library/" + item.uid + "/audio"
                headers = {'Authorization': token}
                params = {location:  dirs.MusicDir + "/yue/" + file_name}

                var f_obj = await this._doDownloadOne(url, params, headers)

                await this.state.db.t.songs.update({uid: item.uid}, {
                    synced: true,
                    file_path: params.location,
                })

            }

        }

    }

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
                console.log('You can use the camera');
                return true;
            } else {
                console.log('Camera permission denied');
                return false;
            }
        } catch (err) {
            console.warn(err);
        }
    }


    async _doDownloadOne(url, params, headers) {
        return await new Promise((resolve, reject) => {
            downloadFile(url, headers, params,
                resolve, reject, (progress) => {console.log(progress)})
        })
    }

    play() {
        this._play().then(
            (result) => {console.log("sync complete")},
            (error) => {console.error(error)}
        )
    }

    async _play() {

        var result = await this.state.db.execute("SELECT uid, artist, album, title, file_path, art_path, length from songs WHERE synced == 1 LIMIT 1", [])

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

                    //<TouchableOpacity onPress={() => {this.insertRow()}}>
                    //    <Text style={{padding: 5}}>Insert</Text>
                    //</TouchableOpacity>

        return (
            <View style={{
                flex:1,
                alignItems:'center',
                justifyContent: 'center',
                height:'100%'
            }}>
                {this.state.db===null?null:
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

                    <TouchableOpacity onPress={() => {this.expandToggle()}}>
                        <Text style={{padding: 5}}>Expand All</Text>
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

                {this.state.db===null?null:
                    <View style={{
                        flex:1,
                        flexDirection: 'row',
                    }}>

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
});

const bindActions = dispatch => ({
});

export default connect(mapStateToProps, bindActions)(SyncPage);
