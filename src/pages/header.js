
import React from "react";
import { View, Button, Text, StyleSheet, TouchableOpacity} from "react-native";

import { connect } from "react-redux";

import { pushLocation } from "../redux/actions/routeAction";
import Sound from "../audio/sound";

import SvgMenu from '../assets/icon/menu.svg'

export const Svg = 'img';

const styles = StyleSheet.create({
    container: {
        //backgroundColor: '#2c3e50',
        backgroundColor: '#406f9d',
        height: 100
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

                <View  style={{zIndex:30, position: 'fixed', left: 0, top: 0, width: 32, height: 32}}>
                    <TouchableOpacity onPress={() => {console.log(this.props.toggle); this.props.toggle && this.props.toggle()}}>
                        <Svg src={SvgMenu} style={{width: 32, height: 32}}/>
                    </TouchableOpacity>
                </View>

                <Sound />

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



