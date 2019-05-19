

import React from 'react';
import { Text, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

import { pushLocation } from '../common/components/Route'

class LoginPage extends React.Component {

    componentDidMount() {
        console.log("mount login")
    }

    componentWillUnmount() {
        console.log("unmount login")
    }
    render() {
        return (
            <View style={{
                flex:1,
                alignItems:'center',
                justifyContent: 'center',
                height:'100%'
            }}>
                <TouchableOpacity onPress={() => this.props.pushLocation('/u/storage')}>
                    <Text>{'Route:' + this.props.location}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    location: state.route.location,
});

const bindActions = dispatch => ({
    pushLocation: (location) => dispatch(pushLocation(location)),
});

export default connect(mapStateToProps, bindActions)(LoginPage);
