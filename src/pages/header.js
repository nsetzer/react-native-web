
import React from "react";
import { View, Button, Text, StyleSheet} from "react-native";

import { connect } from "react-redux";

import { pushLocation } from "../redux/actions/routeAction";

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#CCCCFF'
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
        const pathname = this.props.location;
        const username = this.props.username;
        const token = this.props.token;
        return (
                <View style={styles.container}>
                <Text>Welcome to React Native Web️ </Text>
                <Text> {pathname + " : " + username + " : " + token} </Text>

                <View style={styles.row}>
                    <Button title='Route1' onPress={()=>{this.props.pushLocation('/u/p1')}} />
                    <Button title='Route2' onPress={()=>{this.props.pushLocation('/u/p2')}} />
                    <Button title='Route3' onPress={()=>{this.props.pushLocation('/u/p3')}} />
                </View>
                </View>
        )
    }
}

const mapStateToProps = state => (
    console.log("HEADER =---------------------"),
    console.log(state),
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



