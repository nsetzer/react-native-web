/**
 * @format
 */

import {b64encode, b64decode} from './b64'
global.btoa = b64encode
global.atob = b64decode

import {AppRegistry} from 'react-native';
//import App from './App';
import {name as appName} from './app.json';

import TrackPlayer from 'react-native-track-player';

import MainApp from './src/App'

AppRegistry.registerComponent(appName, () => MainApp);

TrackPlayer.registerPlaybackService(() => require('./src/service.js'));

