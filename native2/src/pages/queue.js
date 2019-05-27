

import React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

import TrackPlayer from 'react-native-track-player';

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


class QueuePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            queue: []
        }
    }

    componentWillMount() {


        TrackPlayer.getQueue().then(
            (tracks) => {this.setState({queue: tracks})},
            (error) => {this.setState({queue: []})},
        )
    }

    itemKeyExtractor = (key, index) => 'n_' + index.toString();

    itemRenderItem = ({item, index}) => (
        <View
            key={item.id}
            title={item}
            >
            <Text>{index+1}. {item.artist} - {item.title}</Text>
        </View>
    );

    render() {
        return (
            <View style={{
                flex:1,
                alignItems:'center',
                justifyContent: 'center',
                height:'100%'
            }}>

                {(!this.props.db)?<Text>error loading db</Text>:
                    <View style={{
                        flex:1,
                        flexDirection: 'row',
                    }}>

                    <TouchableOpacity onPress={() => {this.search()}}>
                        <Text style={{padding: 5}}>Search</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {this.play()}}>
                        <Text style={{padding: 5}}>play</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {this.pause()}}>
                        <Text style={{padding: 5}}>pause</Text>
                    </TouchableOpacity>

                    </View>
                }

                <FlatList
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
});

const bindActions = dispatch => ({
});

export default connect(mapStateToProps, bindActions)(QueuePage);
