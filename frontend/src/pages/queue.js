

import React from "react";
import { ScrollView, View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet} from "react-native";

import { connect } from "react-redux";

import {
  audioLoadDomain,
  audioPopulateQueue,
  audioCreateQueue,
  audioLoadQueue,
  audioPlaySong,
  audioNextSong,
  audioPrevSong,
} from "../redux/actions/audioAction";

const styles = StyleSheet.create({
    listItemContainer: {
        padding: 10,
        borderColor: '#000000',
        borderWidth: 1,
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        backgroundColor: "#FFFFFF",
        shadowOffset: {  width: 4,  height: 4,  },
        shadowColor: '#000000',
        shadowOpacity: 0.6,
        shadowRadius: 2,
    },
    listItemRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 15,
    },
    footer: {
        height: 100,
        width: '100%',
    },
    input: {
        flex: 1,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
});


class ListItem extends React.PureComponent {

    render() {

        /*
                    <View style={{
                            borderColor: '#000000',
                            borderWidth: 3,
                            width: 80,
                            height: 60}}>
                    </View>
        */

        return (
            <View style={styles.listItemContainer}>
                <View style={styles.listItemRow}>




                    <Text>{this.props.queue_index == this.props.index ? "(" + (1 + this.props.index) + ")" : 1 + this.props.index}.</Text>
                    <TouchableOpacity onPress={() => {this.props.onPress(this.props.song)}}>
                        <Text style={{padding: 5, width: '100%'}}>{
                            this.props.song.artist + " - " + this.props.song.title}</Text>
                    </TouchableOpacity>

                </View>

            </View>
        );
    }
}


function itemMapStateToProps (state) {
  return {
    token: state.userLogin.token,
    queue_index: state.audio.queue_index,
  }
}

const itemBindActions = dispatch => ({
});

const ListItemC = connect(itemMapStateToProps, itemBindActions)(ListItem);

class ListFooter extends React.PureComponent {
  render() {
    return (<View style={styles.footer}></View>)
  }
}

export class QueuePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {query: ""}
    }

    itemKeyExtractor = (item, index) => { return item.id; }

    itemRenderItem = ({item, index}) => (
        <ListItemC
            song={item}
            index={index}
            onPress={this.itemOnPress}
        ></ListItemC>
    );

    itemOnPress = (data) => {
        console.log("press")
    };

    render() {

        // flat list was not behaving
        /*<FlatList
                data={this.props.queue}
                extraData={this.props}
                keyExtractor={this.itemKeyExtractor}
                renderItem={this.itemRenderItem.bind(this)}
                ListFooterComponent={ListFooter}
                removeClippedSubviews={false}
                />*/

        return (
            <View>

            <View style={styles.input}>
            <TextInput
                style={{flexGrow: 2, borderWidth: 1, borderColor: '#000000'}}
                onChangeText={(query) => this.setState({query})}
            />
            <TouchableOpacity onPress={() => {this.props.audioCreateQueue(this.state.query)}}>
                <Text style={{padding: 10}}>Create</Text>
            </TouchableOpacity>
            </View>

            {this.props.queue.map((item, index) => {
                return <ListItemC
                    key={index + ":" + item.id}
                    song={item}
                    index={index}
                    onPress={this.itemOnPress}
                ></ListItemC>
            })}

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

export default connect(mapStateToProps, bindActions)(QueuePage);