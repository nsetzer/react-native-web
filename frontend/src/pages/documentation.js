
import React from "react";
import { Text, TextInput, View } from "react-native";

import { connect } from "react-redux";

import { getCurlDocumentation } from "../common/api";

export class Page1 extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            documentation: "loading..."
        }
    }

    componentWillMount() {
        console.log("page 1 componentWillMount")

        getCurlDocumentation().then(
            (response) => {this.setState({documentation: response.data})},
            (error) => {this.setState({documentation: error})}
        )
    }

    render() {

        return (
            <View>

                <Text style={{padding: 5}}>{this.state.documentation}</Text>

            </View>
        )
    }
}


const mapStateToProps = state => ({
});

const bindActions = dispatch => ({
});

export default connect(mapStateToProps, bindActions)(Page1);

