

import React from 'react';
import { Text, View } from "react-native";
import { connect } from "react-redux";

export class LibraryPage extends React.Component {

    render() {
        return (
            <View style={{
                flex:1,
                alignItems:'center',
                justifyContent: 'center',
                height:'100%'
            }}>
                <Text>Page Content</Text>
            </View>
        );
    }
}

const mapStateToProps = state => ({
});

const bindActions = dispatch => ({
});

export default connect(mapStateToProps, bindActions)(LibraryPage);
