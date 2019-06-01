
import React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

import TrackPlayer from 'react-native-track-player';

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

const INITIAL_STATE = {
    queue: [],
    current_track_id: null,
    current_track_idx: -1,
    current_track: null,
}

export function audioReducer(state = INITIAL_STATE, action = {}) {
    switch(action.type) {

        case AUDIO_SET_QUEUE_ACTION:
            console.log("QUEUE: set queue")
            return {
                ...state,
                queue: action.tracks
            }

        case AUDIO_SET_CURRENT_TRACK:
            console.log("QUEUE: set track")
            console.log(action)
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
        TrackPlayer.setupPlayer({}).then(() => {

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


            TrackPlayer.addEventListener('playback-track-changed', (obj) => {
                this.props.setCurrentTrack(obj.nextTrack)
            })

            this.props.getQueue()
            this.props.getCurrentTrack()

        },
        (error) => {console.log(error)});

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
