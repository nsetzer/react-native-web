

import React from 'react';
import { Text, View } from "react-native";
import { connect } from "react-redux";

export class SettingsPage extends React.Component {

    render() {
        return (
            <View><Text>Page Content</Text></View>
        );
    }
}

const mapStateToProps = state => ({
});

const bindActions = dispatch => ({
});

export default connect(mapStateToProps, bindActions)(SettingsPage);
