import { combineReducers } from 'redux';

// not import default class
// the import statement aliases that class
// e.g. import data from './dataReducer' is also valid

import example from './exampleReducer';
import appData from './dataReducer'
import route from './routeReducer'
import userLogin from './userLoginReducer'
import userNote from './userNoteReducer'
import audio from './audioReducer'
import modal from './modalReducer'

// the name here is used as the top level key
// in the state dictionary. the value of that key will
// be the state of the reducer, see the initial state
// defined in that reducer for the structure.

const reducers = {
    example,
    appData,
    route,
    userLogin,
    userNote,
    audio,
    modal
};

export default combineReducers(reducers)