

import React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, AsyncStorage} from "react-native";
import { connect } from "react-redux";

import TrackPlayer from 'react-native-track-player';

import { audioGetQueue, audioSaveQueue } from '../audio'

const styles = StyleSheet.create({
    footer: {
        height: 100,
        width: '100%',
    },
});

class QueueFooter extends React.PureComponent {
  render() {
    return (<View style={styles.footer}></View>)
  }
}

class QueueItem extends React.PureComponent {

    moveUp() {
        this.props.moveUp(this.props.index)
    }

    moveDown() {
        this.props.moveDown(this.props.index)
    }

    removeTrack() {
        console.log("remove: " + this.props.index)
        this.props.removeTrack(this.props.index)
    }

    render() {
        return (
            <View style={{flex:1, flexDirection: 'row', alignItems: 'center', width: '100%',
                marginBottom: 7,
                borderColor: 'black',
                borderWidth: 1,
                backgroundColor: (this.props.isCurrent==this.props.track.id)?'#00005533':'transparent'
            }}
            >
                <Text style={{padding: 5, width: 40, fontWeight: '300', textAlign: 'right'}}>{this.props.index+1}</Text>
                <View style={{flex:1, flexDirection: 'column', alignItems: 'flex-start'}}>
                    <Text style={{fontWeight: '900', padding: 5}}>{this.props.track.title}</Text>
                    <Text style={{fontWeight: '300', padding: 5}}>{this.props.track.artist}</Text>
                </View>
                {(this.props.isCurrent===this.props.track.id)?null:
                    <View style={{flex:1, flexDirection: 'column', alignItems: 'flex-end'}}>
                        <TouchableOpacity onPress={this.moveUp.bind(this)}>
                            <Text style={{padding: 5, }}>UP</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.moveDown.bind(this)}>
                            <Text style={{padding: 5}}>DN</Text>
                        </TouchableOpacity>
                    </View>
                }

                {(this.props.isCurrent===this.props.track.id)?null:
                    <TouchableOpacity onPress={this.removeTrack.bind(this)}>
                        <Text style={{padding: 5}}>RM</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }

}

class QueuePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            queue: [],
            queue_dirty: true,
            current_track_id: null
        }
    }

    componentWillMount() {

        //this.props.getQueue()
        console.log("queue page: on mount")
        this._getQueue()

    }

    componentDidUpdate(prevProps, prevState) {

        if (prevProps.current_track_id != prevState.current_track_id) {
            console.log("queue page: props demand updates")
            this.setState({
                current_track_id: prevProps.current_track_id,
                queue_dirty: true
            })
        }
    }

    _getQueue() {
        TrackPlayer.getQueue().then(
            (tracks) => {
                console.log("queue page: fetched queue")
                this.setState({queue: tracks})
            },
            (error) => {
                console.log("queue page: error fetching queue")
                this.setState({queue: []})
            },
        )
    }

    moveUp(index) {

        var track = this.state.queue[index];

        if (this.props.current_track_id == track.id) {
            return
        }

        if (index-1 < 0) {
            return
        }

        var insertBeforeId = this.state.queue[index-1].id

        TrackPlayer.remove(track.id).then(
            () => {
                TrackPlayer.add(track, insertBeforeId).then (
                    () => {
                        this._getQueue()
                    },
                    (error) => {console.log(error)}
                )
            },
            (error) => {console.log(error)}
        )

        this.setState({'queue_dirty': true})
    }

    moveDown(index) {

        var track = this.state.queue[index];

        if (this.props.current_track_id == track.id) {
            return
        }

        var insertBeforeId = null;
        if (index+2 < this.state.queue.length) {
            insertBeforeId = this.state.queue[index+2].id
        }

        TrackPlayer.remove(track.id).then(
            () => {
                TrackPlayer.add(track, insertBeforeId).then (
                    () => {
                        this._getQueue()
                    },
                    (error) => {console.log(error)}
                )
            },
            (error) => {console.log(error)}
        )

        this.setState({'queue_dirty': true})
    }

    removeTrack(index) {

        var track = this.state.queue[index];

        if (this.props.current_track_id == track.id) {
            return
        }

        TrackPlayer.remove(track.id).then(
            () => {

            this._getQueue()

        })

        this.setState({'queue_dirty': true})
    }

    itemKeyExtractor = (item, index) => item.id;

    itemRenderItem = ({item, index}) => (
        <QueueItem
            key={item.id}
            track={item}
            index={index}
            isCurrent={this.props.current_track_id}
            moveUp={this.moveUp.bind(this)}
            moveDown={this.moveDown.bind(this)}
            removeTrack={this.removeTrack.bind(this)}
            />
    );

    play() {
        TrackPlayer.play();

        TrackPlayer.updateOptions({
            stopWithApp: false,
        })
    }

    pause() {
        TrackPlayer.pause();

        console.log("queue page: enable stop with app")
        TrackPlayer.updateOptions({
            stopWithApp: true,
        })

        console.log(this.state.queue_dirty)

        if (this.state.queue_dirty) {
            this.setState({queue_dirty: false}, () => {
                audioSaveQueue(0,
                    this.state.queue,
                    {current_track_id: this.state.current_track_id}
                ).then(
                    () => {"queue page: saved"},
                    (error) => {"queue page: save failed"},
                );
            });
        }
    }

    stop() {
        TrackPlayer.stop();

        console.log("queue page: enable stop with app")
        TrackPlayer.updateOptions({
            stopWithApp: true,
        })

        console.log(this.state.queue_dirty)

        if (this.state.queue_dirty) {
            this.setState({queue_dirty: false}, () => {
                audioSaveQueue(0,
                    this.state.queue,
                    {current_track_id: this.state.current_track_id}
                ).then(
                    () => {"queue page: saved"},
                    (error) => {"queue page: save failed"},
                );
            });
        }
    }

    previous() {
        TrackPlayer.skipToPrevious().then(
            () => {
                this.setState({'queue_dirty': true})
            },
            (error) => {console.log(error)},
        )
    }

    next() {
        TrackPlayer.skipToNext().then(
            () => {
                this.setState({'queue_dirty': true})
            },
            (error) => {console.log(error)},
        )
    }

    render() {
        return (
            <View>
                <View style={{
                    flex:1,
                    alignItems:'center',
                    justifyContent: 'center',
                    height:'100%',
                    width:'100%',
                }}>

                    {(!this.props.db)?<Text>error loading db</Text>:
                        <View style={{
                            flex:1,
                            flexDirection: 'row',
                        }}>

                        <TouchableOpacity onPress={() => {this.play()}}>
                            <Text style={{padding: 5}}>play</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {this.pause()}}>
                            <Text style={{padding: 5}}>pause</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {this.stop()}}>
                            <Text style={{padding: 5}}>stop</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {this.next()}}>
                            <Text style={{padding: 5}}>next</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {this.previous()}}>
                            <Text style={{padding: 5}}>prev</Text>
                        </TouchableOpacity>

                        </View>
                    }
                </View>

                <FlatList
                    style={{marginRight: 10, marginLeft: 10}}
                    data={this.state.queue}
                    extraData={this.state}
                    keyExtractor={this.itemKeyExtractor}
                    renderItem={this.itemRenderItem.bind(this)}
                    ListFooterComponent={QueueFooter}
                    initialNumToRender={5}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                />

            </View>
        );
    }
}

const mapStateToProps = state => ({
    db: state.sqldb.db,
    current_track_id: state.audio.current_track_id,
    audio: state.audio
});

const bindActions = dispatch => ({
    getQueue: () => {audioGetQueue(dispatch)},
    getCurrentTrack: () => {audioGetCurrentTrack(dispatch)},
});

export default connect(mapStateToProps, bindActions)(QueuePage);
