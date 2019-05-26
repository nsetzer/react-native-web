
import { all } from 'redux-saga/effects';
import {sqldbOpenSagaHandler} from '../../db';

function* rootSaga () {
    yield all([
        //TODO: sagas not working in react-native???
        //sqldbOpenSagaHandler,
    ]);
}

export default rootSaga