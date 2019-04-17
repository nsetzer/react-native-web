
import React from "react";
import { View, Button, Text, StyleSheet} from "react-native";

import { connect } from "react-redux";

import { pushLocation } from "../redux/actions/routeAction";

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#CCCCFF',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    rowItem: {
      backgroundColor: '#803030'
    },
});

export class HeaderPage extends React.Component {
    render() {
        return (
                <View style={styles.container}>
                <Text>Welcome to React Native Web️ </Text>

                <View style={styles.row}>
                    <Button title='Route1' onPress={()=>{this.props.pushLocation('/u/p1')}} />
                    <Button title='Route2' onPress={()=>{this.props.pushLocation('/u/p2')}} />
                    <Button title='Route3' onPress={()=>{this.props.pushLocation('/u/p3')}} />
                    <Button title='Notes' onPress={()=>{this.props.pushLocation('/u/p4')}} />
                    <Button title='Storage' onPress={()=>{this.props.pushLocation('/u/p5/')}} />
                </View>
                </View>
        )
    }
}

const mapStateToProps = state => (
{
    location: state.route.location,
    username: state.userLogin.username,
    token: state.userLogin.token
});

const bindActions = dispatch => ({
    pushLocation: (location) => {
        dispatch(pushLocation(location))
    }
});

export default connect(mapStateToProps, bindActions)(HeaderPage);



