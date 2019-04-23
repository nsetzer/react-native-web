
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
  audioCreateQueue,
  audioLoadQueue,
  audioPlaySong,
  audioNextSong,
  audioPrevSong,
} from "../redux/actions/audioAction";

import { env, historyIncrementPlaycount } from '../redux/api'

// https://github.com/goldfire/howler.js#documentation
// https://github.com/goldfire/howler.js/blob/master/examples/player/player.js
// https://howlerjs.com/#player

function formatTime(secs) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = Math.floor(secs - minutes * 60) || 0;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

const styles = StyleSheet.create({
    column: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    row: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      width: '100%'
    },
    rowItem: {
      backgroundColor: '#803030'
    },
});


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
        playing: false,  // whether autoplayback is enabled
        volume: 0.5,
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

    if (this.state.current_sound) {
      this.state.current_sound.unload()
    }

    console.log("load: " + url)
    const sound = new Howl({
      src: [url],
      format: ['ogg'],
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

    sound.volume(this.state.volume)

    this.setState({
      current_sound: sound,
      current_sound_id: null,
      queue_id: null,
      queue_index: 0,
      song: null})
  }

  onLoad(sound_id) {

    console.log("on load: is playing: " + this.state.playing)
    if (this.state.playing) {
      const sound_id = this.state.current_sound.play()
      this.setState({current_sound_id: sound_id})
    }
  }

  onLoadError(sound_id, error) {
    console.log("on load error: " + sound_id)
    console.log(error)
    console.log("on load error: " + error.message)
  }

  onPlay(sound_id) {
    console.log("on play: " + sound_id)
    //this.setState({playing: true})
  }

  onPause(sound_id) {
    console.log("on pause: " + sound_id)
    //this.setState({playing: false})
  }

  onStop(sound_id) {
    console.log("on stop: " + sound_id)
    //this.setState({playing: false})
  }

  onEnd(sound_id) {
    console.log("on end: " + sound_id)
    //this.setState({playing: false})

    if (this.state.song !== null) {
      historyIncrementPlaycount(this.state.song.id).then(
        (result) => {console.log("updated song")}
      ).catch((result) => {
        console.log("failed to update song");
        console.log(result)
      })
    }

    console.log(this.props.queue_index + "/" + this.props.queue.length)
    if (this.props.queue_index < this.props.queue.length - 1) {
      this.props.audioNextSong()
    }
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

    if (!this.state.current_sound_id) {
      const sound_id = this.state.current_sound.play()
      this.setState({current_sound_id: sound_id, playing:true})

    } else {

      if (this.state.current_sound.playing(this.state.current_sound_id)) {
        this.setState({playing: false})
        this.state.current_sound.pause(this.state.current_sound_id)
        console.log("is playing: false" )
      } else {
        this.setState({playing: true})
        this.state.current_sound.play(this.state.current_sound_id)
        console.log("is playing: true" )

      }


    }

  }

  onSeekEndClicked() {

    if (this.state.current_sound_id) {
      const duration = this.state.current_sound.duration()
      this.state.current_sound.seek(duration - 1)
    }

  }

  onPopulateQueueClicked() {
    this.props.audioCreateQueue("")
  }

  onPrevClicked() {
    this.props.audioPrevSong()
  }

  onNextClicked() {
    this.props.audioNextSong()
  }

  setVolume(volume) {
    const v = Math.max(0.0, Math.min(0.75, volume))

    this.setState({volume: v})

    if (this.state.current_sound) {
      this.state.current_sound.volume(v)
    }

  }

  componentDidMount() {
    this.timer = this.launchTimer();

    if (!this.props.domain_loaded) {
        if (!this.props.domain_loading) {
          console.log("loading domain info")
          this.props.audioLoadDomain()
        }
    }
    if (!this.props.queue_loaded) {
        if (!this.props.queue_loading) {
          console.log("loading queue info")
          this.props.audioLoadQueue()
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
          url += '&mode=ogg'

          this.load(url)
        }

        new_state['song'] = song || null
        console.log(song)

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

      <View  style={styles.column}>

        {(!this.state.song)?
          <Text>select a song to play</Text>:
          <Text>{this.state.song.artist + " - " + this.state.song.title}</Text>
          }

        <View style={styles.row}>

        <Text>{formatTime(this.state.position)} / {formatTime(this.state.duration)}</Text>

        {(!this.props.queue_loaded)?
          <Text>queue not loaded</Text>:
          <View><Text>{this.props.queue_index + "/" + this.props.queue.length }</Text>
          </View>}

        <TextInput
          onChangeText={(text) => this.setVolume(parseInt(text)/100.0)}
          defaultValue={50}
          maxLength={3}/>
        </View>

        <View style={styles.row}>
        <TouchableOpacity onPress={() => {this.onPlayClicked()}}>
          <Text>{this.state.playing?"Pause":"Play"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {this.onSeekEndClicked()}}>
          <Text>Seek End</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {this.onPopulateQueueClicked()}}>
          <Text>Populate Queue</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {this.onPrevClicked()}}>
          <Text>Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {this.onNextClicked()}}>
          <Text>Next</Text>
        </TouchableOpacity>
        </View>

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
    audioCreateQueue: (query) => {
        dispatch(audioCreateQueue(query))
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
