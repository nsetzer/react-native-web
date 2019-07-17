
import React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

import AsyncStorage from '@react-native-community/async-storage'

import TrackPlayer from 'react-native-track-player';

var state_map = {}
state_map[TrackPlayer.STATE_NONE] = "STATE_NONE"
state_map[TrackPlayer.STATE_PLAYING] = "STATE_PLAYING"
state_map[TrackPlayer.STATE_PAUSED] = "STATE_PAUSED"
state_map[TrackPlayer.STATE_STOPPED] = "STATE_STOPPED"
state_map[TrackPlayer.STATE_BUFFERING] = "STATE_BUFFERING"
state_map[TrackPlayer.STATE_READY] = "STATE_READY"

export const AUDIO_SET_QUEUE_ACTION = "AUDIO_SET_QUEUE_ACTION"
export const AUDIO_SET_CURRENT_TRACK = "AUDIO_SET_CURRENT_TRACK"

function audioSetQueueAction(tracks) {
    return {
      type: AUDIO_SET_QUEUE_ACTION,
      tracks: tracks
    }
}

function audioSetCurrentTrackAction(uid) {
    console.log("audioSetCurrentTrackAction:" + uid)
    return {
      type: AUDIO_SET_CURRENT_TRACK,
      uid: uid
    }
}

export function audioGetQueue(dispatch) {
    TrackPlayer.getQueue().then(
        (tracks) => {dispatch(audioSetQueueAction(tracks))},
        (error) => {dispatch(audioSetQueueAction([]))},
    )
}

export function audioGetCurrentTrack(dispatch) {
    TrackPlayer.getCurrentTrack().then(
        (uid) => {dispatch(audioSetCurrentTrackAction(uid))},
        (error) => {dispatch(audioSetQueueAction([]))},
    )
}

export function audioSaveQueue(index, tracks, options=null) {

    return new Promise(async resolve => {

        var obj = {index, tracks, options}
        var str = JSON.stringify(obj)

        console.log(str)
        await AsyncStorage.setItem('yue-audio-queue', str)

        return true;
    });
}

export function audioLoadQueue() {

    return new Promise(async resolve => {
        const str = await AsyncStorage.getItem('yue-audio-queue')
        console.log(str)
        // TODO: fix this, there should not be any undefined values
        // in the first place
        var obj = JSON.parse(str.replace("undefined", "null"))
        console.log(obj)
        resolve(obj)
    });
}

const INITIAL_STATE = {
    queue: [],
    current_track_id: null,
    current_track_idx: -1,
    current_track: null,
}

export function audioReducer(state = INITIAL_STATE, action = {}) {
    switch(action.type) {

        case AUDIO_SET_QUEUE_ACTION:
            console.log("QUEUE: set queue " + action.tracks.length)
            return {
                ...state,
                queue: action.tracks
            }

        case AUDIO_SET_CURRENT_TRACK:

            var idx = -1;
            for (var i=0; i < state.queue.length; i++) {
                if (state.queue[i].id === action.uid) {
                    idx = i;
                    break;
                }
            }
            var track = null
            if (idx >= 0 && idx < state.queue.length) {
                track = state.queue[idx]
            }
            console.log("QUEUE: set track: " + idx + "/" + state.queue.length)
            console.log(action)
            console.log(track)
            return {
                ...state,
                current_track_id: action.uid,
                current_track_idx: idx,
                current_track: track,
            }

        default:
            return state
    }
}

class IAudioComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {

        console.log("QUEUE: set up")

        TrackPlayer.getQueue().then(
            (tracks) => {

                console.log("audio: on initial load " + tracks.length)

                if (tracks.length == 0) {
                    TrackPlayer.setupPlayer({}).then(
                        () => {
                            this._init_main()
                            this._init_secondary()
                        },
                        (error) => {console.log(error)}
                    );
                } else {
                    this._init_main()
                    //this.props.getQueue()
                    this.props.getCurrentTrack()
                }
            },
            (error) => {console.log(error)}
        );

    }

    _init_main() {
        TrackPlayer.updateOptions({
            stopWithApp: true,
            capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
            ],
            compactCapabilities: [
              TrackPlayer.CAPABILITY_PLAY,
              TrackPlayer.CAPABILITY_PAUSE,
            ]
        });

        TrackPlayer.addEventListener('playback-track-changed', (obj) => {
            this.props.setCurrentTrack(obj.nextTrack)
        })

        TrackPlayer.addEventListener('playback-state', (state) => {
            console.log("playback state: " + state_map[state.state])
        })

        TrackPlayer.addEventListener('playback-error', (obj) => {
            console.log("playback error: " + obj.code + " -- " + obj.message)
        })
    }

    _init_secondary() {
        audioLoadQueue().then(
            async (obj) => {
                await TrackPlayer.reset()
                await TrackPlayer.add(obj.tracks);
                await TrackPlayer.skip(obj.options.current_track_id);
            },
            (error) => {

            }
        );
    }

    render() {
        return null
    }

}

const mapStateToProps = state => ({
});

const bindActions = dispatch => ({

    getQueue: () => {audioGetQueue(dispatch)},
    getCurrentTrack: () => {audioGetCurrentTrack(dispatch)},

    setCurrentTrack: (uid) => {dispatch(audioSetCurrentTrackAction(uid))},
});

export const AudioComponent = connect(mapStateToProps, bindActions)(IAudioComponent);
