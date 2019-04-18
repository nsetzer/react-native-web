
import React from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Image,
  Button,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import { connect } from "react-redux";

import { Howl } from 'howler'

import {
  audioLoadDomain,
  audioPopulateQueue,
  audioLoadQueue,
  audioPlaySong,
  audioNextSong,
  audioPrevSong,
} from "../redux/actions/audioAction";

import { env } from '../redux/api'


// https://github.com/goldfire/howler.js#documentation
// https://github.com/goldfire/howler.js/blob/master/examples/player/player.js
// https://howlerjs.com/#player

const sample_url = require('./sample.ogg');

function formatTime(secs) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = Math.floor(secs - minutes * 60) || 0;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

export class Sound extends React.PureComponent {
  static setCategory() {}

  constructor(props) {
    super(props)

    this.state = {
        current_sound: null,
        current_sound_id: null,
        error: null,
        duration: 0,
        position: 0,
        playing: false
    }

    this.play = this.play.bind(this)
    this.stop = this.stop.bind(this)
  }

  play() {
    if (this.sound.state() !== 'loaded') return this
    this.sound.play()
    return this
  }

  stop() {
    this.sound.stop()
    return this
  }

  load(url) {

    console.log("load: " + url)
    const sound = new Howl({
      src: [url],
      format: ['mp3'],
      html5: true,
      autoplay: false,
      onload: this.onLoad.bind(this),
      onloaderror: this.onLoadError.bind(this),
      onplay: this.onPlay.bind(this),
      onpause: this.onPause.bind(this),
      onstop: this.onStop.bind(this),
      onend: this.onEnd.bind(this),
      onvolume: this.onVolume.bind(this),
      onmute: this.onMute.bind(this),
      onseek: this.onSeek.bind(this),
    })

    this.setState({
      current_sound: sound,
      current_sound_id: null,
      queue_id: null,
      queue_index: 0,
      song: null})
  }

  onLoad(sound_id) {
    console.log("on load: " + sound_id)
  }

  onLoadError(sound_id, error) {
    console.log("on load error: " + sound_id)
    console.log(error)
    console.log("on load error: " + error.message)
  }

  onPlay(sound_id) {
    console.log("on play: " + sound_id)
    this.setState({playing: true})
  }

  onPause(sound_id) {
    console.log("on pause: " + sound_id)
    this.setState({playing: false})
  }

  onStop(sound_id) {
    console.log("on stop: " + sound_id)
    this.setState({playing: false})
  }

  onEnd(sound_id) {
    console.log("on end: " + sound_id)
    this.setState({playing: false})
  }

  onVolume(sound_id) {
    console.log("on volume: " + sound_id)
  }

  onMute(sound_id) {
    console.log("on mute: " + sound_id)
  }

  onSeek(sound_id) {
    console.log("on seek: " + sound_id)
  }

  onTimeout() {

    if (this.state.current_sound_id) {
      const duration = this.state.current_sound.duration()
      const position = this.state.current_sound.seek()
      this.setState({duration, position})
    }
  }


  // button actions
  onPlayClicked() {

    if (!this.state.current_sound) {
      console.error("no audio set")

      this.load(sample_url)
      return
    }

    if (!this.state.current_sound_id) {
      const sound_id = this.state.current_sound.play()
      this.setState({current_sound_id: sound_id})
    } else {

      if (this.state.current_sound.playing(this.state.current_sound_id)) {
        this.state.current_sound.pause(this.state.current_sound_id)
      } else {
        this.state.current_sound.play(this.state.current_sound_id)
      }

    }

  }

  onSeekEndClicked() {

    if (this.state.current_sound_id) {
      const duration = this.state.current_sound.duration()
      this.state.current_sound.seek(duration - 3)
    }

  }

  onPopulateQueueClicked() {
    this.props.audioPopulateQueue()
  }

  componentDidMount() {
    this.timer = this.launchTimer();

    if (!this.props.domain_loaded) {
        if (!this.props.domain_loading) {
          console.log("loading domain info")
          this.props.audioLoadDomain()
        }
    }
  }

  componentDidUpdate(prevProps, prevState) {

      const new_state = {}
      if (this.props.queue_id != this.state.queue_id ||
          this.props.queue_index != this.state.queue_index) {

        new_state['queue_id'] = this.props.queue_id
        new_state['queue_index'] = this.props.queue_index

        const song = this.props.queue[this.props.queue_index]

        if (song) {
          var url = env.baseUrl + '/api/library/' + song.id + '/audio'

          url += '?token=' + this.props.token
          url += '&mode=mp3'

          this.load(url)
        }

        new_state['song'] = song || null

      }

      if (Object.keys(new_state).length > 0) {
        this.setState(new_state)
      }
      return new_state;
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  launchTimer = () => {
    this.timer = setInterval(this.onTimeout.bind(this), 333);
  };

  render () {

      //<Text>{"artists: " + (this.props.domain ? (" " + this.props.domain.artists.length) : 0)}</Text>
      //  <Text>{"num_songs: " + (this.props.domain ? (" " + this.props.domain.num_songs) : 0)}</Text>

    return (

      <View>

        <TouchableOpacity onPress={() => {this.onPlayClicked()}}>
          <Text>{this.state.playing?"Pause":"Play"}</Text>
        </TouchableOpacity>

        <Text>{formatTime(this.state.position)} / {formatTime(this.state.duration)}</Text>

        <TouchableOpacity onPress={() => {this.onSeekEndClicked()}}>
          <Text>Seek End</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {this.onPopulateQueueClicked()}}>
          <Text>Populate Queue</Text>
        </TouchableOpacity>

        {(!this.props.queue_loaded)?
          <Text>queue not loaded</Text>:
          <View><Text>{this.props.queue_id}</Text>
          </View>}

        {(!this.state.song)?
          <Text>select a song to play</Text>:
          <Text>{this.state.song.artist + " - " + this.state.song.title}</Text>
          }

         </View>

    );
  }
}

function mapStateToProps (state) {

  return {
    domain: state.audio.domain,
    domain_loading: state.audio.domain_loading,
    domain_loaded: state.audio.domain_loaded,
    domain_error: state.audio.domain_error,
    queue: state.audio.queue,
    queue_loading: state.audio.queue_loading,
    queue_loaded: state.audio.queue_loaded,
    queue_error: state.audio.queue_error,
    queue_id: state.audio.queue_id,
    queue_index: state.audio.queue_index,

    token: state.userLogin.token,
  }
}

const bindActions = dispatch => ({
    audioLoadDomain: () => {
        dispatch(audioLoadDomain())
    },
    audioPopulateQueue: () => {
        dispatch(audioPopulateQueue())
    },
    audioLoadQueue: () => {
        dispatch(audioLoadQueue())
    },
    audioPlaySong: (index) => {
        dispatch(audioPlaySong(index))
    },
    audioNextSong: () => {
        dispatch(audioNextSong())
    },
    audioPrevSong: () => {
        dispatch(audioPrevSong())
    },
});

export default connect(mapStateToProps, bindActions)(Sound);
