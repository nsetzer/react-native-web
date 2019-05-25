

import React from 'react';
import { Text, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

import { dbinit } from '../db';
import { librarySearch } from '../common/api';

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


export class LibraryPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            db: null
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

        var response = await librarySearch("", 10, 0)
        var songs = response.data.result

        for (var i=0; i < songs.length; i++) {
            var song = remoteSongToLocalSong(songs[i])

            await this.state.db.t.songs.upsert({uid: song.uid}, song)
        }

        var count = await this.state.db.t.songs.count()
        console.log(count)

        return
    }

    render() {
        return (
            <View style={{
                flex:1,
                alignItems:'center',
                justifyContent: 'center',
                height:'100%'
            }}>
                <Text>Page Content</Text>
                <Text>{this.state.db===null?'f':'t'}</Text>

                {this.state.db===null?null:
                    <View>
                    <TouchableOpacity onPress={() => {this.insertRow()}}>
                        <Text style={{padding: 5}}>Insert</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {this.fetchData()}}>
                        <Text style={{padding: 5}}>Fetch</Text>
                    </TouchableOpacity>

                    </View>
                }
            </View>
        );
    }
}

const mapStateToProps = state => ({
});

const bindActions = dispatch => ({
});

export default connect(mapStateToProps, bindActions)(LibraryPage);
