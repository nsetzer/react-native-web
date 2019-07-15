

import React from 'react';
import { Text, View } from "react-native";
import { connect } from "react-redux";

class StoragePage extends React.Component {

    render() {
        return (
            <View>
                <Text>Page Content</Text>
            </View>
        );
    }
}

const mapStateToProps = state => ({
});

const bindActions = dispatch => ({
});

export default connect(mapStateToProps, bindActions)(StoragePage);
