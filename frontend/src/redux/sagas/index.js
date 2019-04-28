
import { all } from 'redux-saga/effects';

// there is a bit of a non-standard hack at play here
// the default export is the takeEvery function, all-ready
// applied to the saga, not the saga itself.

import dataSaga from './dataSaga'
import userLoginSaga from './userLoginSaga'

import {
    userNoteFetch,
    userNoteGetContent,
    userNoteSave,
    userNoteDelete
} from './userNoteSaga'

import {
    audioGetDomain,
    audioGetQueue,
    audioPopulateQueue,
    audioCreateQueue,
} from './audioSaga'

function* rootSaga () {
    yield all([
        // add an entry for every saga to listen for
        dataSaga,
        userLoginSaga,
        userNoteFetch,
        userNoteGetContent,
        userNoteSave,
        userNoteDelete,
        audioGetDomain,
        audioPopulateQueue,
        audioCreateQueue,
        audioGetQueue,
    ]);
}

export default rootSaga