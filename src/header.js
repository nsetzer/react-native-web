
import React from "react";
import { View, Button , Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";

import { connect } from "react-redux";

import styles from './styles'

import { pushLocation } from "./redux/actions/routeAction";

export class HeaderPage extends React.Component {
    render() {
        const pathname = this.props.location;
        return (
                <View>
                <Text>Welcome to React Native Web️ </Text>
                <Text> {pathname} </Text>

                <View style={styles.row}>
                    <Button title='Route1' onPress={()=>{this.props.pushLocation('/p1')}} />
                    <Button title='Route2' onPress={()=>{this.props.pushLocation('/p2')}} />
                    <Button title='Route3' onPress={()=>{this.props.pushLocation('/p3')}} />
                </View>
                </View>
        )
    }
}

const mapStateToProps = state => (
{
    location: state.route.location
});

const bindActions = dispatch => ({
    pushLocation: (location) => {
        dispatch(pushLocation(location))
    }
});

export default connect(mapStateToProps, bindActions)(HeaderPage);



