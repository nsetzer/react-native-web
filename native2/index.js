/**
 * @format
 */

import {AppRegistry} from 'react-native';
//import App from './App';
import {name as appName} from './app.json';

import TrackPlayer from 'react-native-track-player';

import MainApp from './src/App'

AppRegistry.registerComponent(appName, () => MainApp);

TrackPlayer.registerPlaybackService(() => require('./src/service.js'));

TrackPlayer.updateOptions({
    capabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_PLAY_FROM_SEARCH,
      TrackPlayer.CAPABILITY_SKIP,
      TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
    ],
  });