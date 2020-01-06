

import React from 'react';
import { connect } from "react-redux";
import { Text, View, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { env, librarySearch, authenticate } from '../common/api';
import { setConfig } from '../config';

export const FETCH_INIT_ACTION = "FETCH_INIT_ACTION"
export const FETCH_BEGIN_ACTION = "FETCH_BEGIN_ACTION"
export const FETCH_UPDATE_ACTION = "FETCH_UPDATE_ACTION"
export const FETCH_TERMINATE_ACTION = "FETCH_TERMINATE_ACTION"
export const FETCH_END_ACTION = "FETCH_END_ACTION"

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

export function fetchInitAction() {
    return {
      type: FETCH_INIT_ACTION,
    }
}

export function fetchBeginAction() {
    return {
      type: FETCH_BEGIN_ACTION,
    }
}

export function fetchUpdateAction(index, count) {
    return {
      type: FETCH_UPDATE_ACTION,
      index: index,
      count: count
    }
}

export function fetchTerminateAction() {
    return {
      type: FETCH_TERMINATE_ACTION,
    }
}

export function fetchEndAction() {
    return {
      type: FETCH_END_ACTION,
    }
}

const INITIAL_STATE = {
    isFetching: false,
    fetchIndex: 0,
    fetchCount: 0,
    fetchAlive: false
}

export function fetchReducer(state = INITIAL_STATE, action = {}) {
    console.log("reducer " + action.type)
    switch(action.type) {
        case FETCH_INIT_ACTION:
            return {
                ...state,
                isFetching: true,
                fetchAlive: true,
                fetchIndex: 0,
                fetchCount: 0,
            }
        case FETCH_BEGIN_ACTION:
            return { ...state, }
        case FETCH_UPDATE_ACTION:
            return {
                ...state,
                fetchIndex: action.index,
                fetchCount: state.fetchCount + action.count,
            }
        case FETCH_TERMINATE_ACTION:
            return {
                ...state,
                fetchAlive: false,
            }
        case FETCH_END_ACTION:
            return {
                ...state,
                isFetching: false,
                fetchIndex: 0,
                fetchCount: 0,
            }
        default:
            return state
    }
}


class IFetchComponent extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            db: null,
            isFetching: false,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isFetching === false && this.props.isFetching === true) {
            console.log("start download")

            this._doFetchInit().then(
                (result) => {},
                (error) => {this._fetchComplete(error);}
            )

        }
    }

    async _doFetchInit() {

        setConfig()

        //this.setState({}, () => {
        //    this._doFetchMain()
        //});

        this._fetchDataV3().then(
            (result) => {
                console.log("fetch complete");
                this.props.fetchEndAction();
            },
            (error) => {
                console.error(error);
                this.props.fetchEndAction();
            }
        )
    }

    async _doFetchMain() {

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


    render() {

        if (!this.props.isFetching) {
            return null
        }

        return (
            <Text style={{padding: 5}}>{"Fetching..."}</Text>
        );


    }
}

const mapStateToProps = state => ({
    db: state.sqldb.db,
    isFetching: state.fetch.isFetching,
    fetchIndex: state.fetch.fetchIndex,
    fetchAlive: state.fetch.fetchAlive,
});

const bindActions = dispatch => ({
    fetchBeginAction: () => {dispatch(fetchBeginAction())},
    fetchUpdateAction: (index) => {dispatch(fetchUpdateAction(index))},
    fetchTerminateAction: () => {dispatch(fetchTerminateAction())},
    fetchEndAction: () => {dispatch(fetchEndAction())},
});


export const FetchComponent = connect(mapStateToProps, bindActions)(IFetchComponent);

console.log(FetchComponent)