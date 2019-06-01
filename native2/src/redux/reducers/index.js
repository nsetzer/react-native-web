import { combineReducers } from 'redux';

// not import default class
// the import statement aliases that class
// e.g. import data from './dataReducer' is also valid

import {routeReducer} from '../../common/components/Route';
import {authReducer} from '../../common/components/Auth';
import {sqldbReducer} from '../../db';
import {audioReducer} from '../../audio';


// the name here is used as the top level key
// in the state dictionary. the value of that key will
// be the state of the reducer, see the initial state
// defined in that reducer for the structure.

const reducers = {
    route: routeReducer,
    auth: authReducer,
    sqldb: sqldbReducer,
    audio: audioReducer,
};

export default combineReducers(reducers)