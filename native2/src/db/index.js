
import React from 'react';
import { connect } from 'react-redux';

import { put, takeEvery } from 'redux-saga/effects'

import { dbinit as dbinit } from './orm'

export const dbName = "yue.sqlite"

export const dbSchema = [
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

            // TODO: record file size and report statistics in a settinngs page
            {name: "file_path",      type: "VARCHAR", },
            {name: "file_size",      type: "INTEGER", },
            {name: "art_path",       type: "VARCHAR", },
            {name: "art_size",       type: "INTEGER", },

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
            {name: "spk",           type: "INTEGER PRIMARY KEY AUTOINCREMENT", },
            {name: "song_id",       type: "VARCHAR", },
            {name: "user_id",       type: "VARCHAR", },
            {name: "timestamp",     type: "INTEGER", },
        ]
    },
    {
        name: 'files',
        columns: [
            {name: "spk",               type: "INTEGER PRIMARY KEY AUTOINCREMENT", },
            {name: "uid",               type: "VARCHAR UNIQUE", },

            {name: "sync",              type: "INTEGER DEFAULT 0", }, // download this resource

            {name: "rel_path",          type: "VARCHAR", },

            {name: "local_version",     type: "VARCHAR", },
            {name: "remote_version",    type: "VARCHAR", },

            {name: "local_size",        type: "VARCHAR", },
            {name: "remote_size",       type: "VARCHAR", },

            {name: "local_permission",  type: "VARCHAR", },
            {name: "remote_permission", type: "VARCHAR", },

            {name: "local_mtime",       type: "VARCHAR", },
            {name: "remote_mtime",      type: "VARCHAR", },

            {name: "remote_public",     type: "VARCHAR", },
            {name: "remote_encryption", type: "VARCHAR", },

        ]
    },
]

// ----------------------------------------------------------------

export const SQLDB_OPEN_ACTION = "SQLDB_OPEN_ACTION"
export const SQLDB_SET_CONNECTION_ACTION = "SQLDB_SET_CONNECTION_ACTION"
export const SQLDB_CLOSE_ACTION = "SQLDB_CLOSE_ACTION"

export function sqldbOpen(dbname, schema) {
    return {
        type: SQLDB_OPEN_ACTION,
        payload: {
            dbname,
            schema
        }
    }
}

export function sqldbSetConnection(db) {
    return {
        type: SQLDB_SET_CONNECTION_ACTION,
        payload: {
            db
        }
    }
}

export function sqldbClose(dbname, schema) {
    return {
        type: SQLDB_CLOSE_ACTION,
    }
}


const INITIAL_STATE = {
    'schema': null,
    'db': null,
}

export function sqldbReducer(state = INITIAL_STATE, action = {}) {
        switch(action.type) {

        case SQLDB_OPEN_ACTION:
            console.log("loading db: open action")
            return {
                ...state,
                schema: action.payload.schema,
            }

        case SQLDB_SET_CONNECTION_ACTION:
            console.log("loading db: assign connection")
            return {
                ...state,
                db: action.payload.db,
            }

        case SQLDB_OPEN_ACTION:
        default:
            return state
    }
}

function* sqldbOpenSagaHandler (action) {
  try {
    console.log("loading db: saga")
    const result = yield dbinit({ name: action.payload.dbname },
        action.payload.schema)
    console.log(result)
    yield put({ type: SQLDB_SET_CONNECTION_ACTION, payload: {db: result.db} })
  } catch (e) {
    yield put({ type: SQLDB_SET_CONNECTION_ACTION, payload: {db: null} })
  }
}

export const sqldbOpenSaga = takeEvery(SQLDB_OPEN_ACTION, sqldbOpenSagaHandler)

// ----------------------------------------------------------------

// a component which opens the database on mount
class ISqlDB extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (!this.props.db) {
            console.log("loading db")
            this.props.sqldbOpen(dbName, dbSchema)

            dbinit({ name: dbName }, dbSchema).then(
                (result) => {
                    this.props.sqldbSetConnection(result.db)
                },
                (error) => {
                    console.log("error opening database")
                }
            )

        }
    }

    render() {
        return null
    }
}

//const mapStateToProps = state => ({
//    db: state.sqldb.db,
//});

const mapStateToProps = state => {
    console.log("load db: assigning props  " + !!state.sqldb.db)
    return {
        db: state.sqldb.db,
    }
}

const bindActions = dispatch => ({
    sqldbOpen: (dbname, schema) => {dispatch(sqldbOpen(dbname, schema))},
    sqldbSetConnection: (db) => {dispatch(sqldbSetConnection(db))},
});

const ctor = connect(mapStateToProps, bindActions);
export const SqlDB = ctor(ISqlDB);

