
import { all } from 'redux-saga/effects';

// there is a bit of a non-standard hack at play here
// the default export is the takeEvery function, all-ready
// applied to the saga, not the saga itself.

import dataSaga from './dataSaga'
import userLoginSaga from './userLoginSaga'

 function* rootSaga () {
    yield all([
        // add an entry for every saga to listen for
        dataSaga,
        userLoginSaga
    ]);
}

export default rootSaga