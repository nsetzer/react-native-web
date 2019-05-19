import { createStore, applyMiddleware } from 'redux';

// https://medium.com/react-native-training/redux-4-ways-95a130da0cdc
// https://github.com/react-native-training/redux-4-ways/tree/saga

import createSagaMiddleware from 'redux-saga'

import reducers from './reducers';

import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(reducers, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga)

export default store;