
import React from "react";
import { Text, TextInput, View, Platform } from "react-native";

import { connect } from "react-redux";

import { fsGetPath } from "../common/api";

export class Page1 extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            text: "loading..."
        }
    }

    componentWillMount() {

        console.log(this.props)

        if (this.props.route.match.root === undefined) {
            console.error("root not set")
            this.setState({text: "error"})
            return
        }

        if (this.props.route.match.path === undefined) {
            console.error("path not set")
            this.setState({text: "error"})
            return
        }

        fsGetPath(this.props.route.match.root, this.props.route.match.path)
            .then((response) => {this.setState({text: response.data});})
            .catch((error) => {this.setState({text: "404"})});

        //getCurlDocumentation().then(
        //    (response) => {this.setState({documentation: response.data})},
        //    (error) => {this.setState({documentation: error.message})}
        //)
    }

    render() {

        const fontFamily = Platform.OS === 'ios' ? 'Courier' : 'monospace'

        return (
            <View>

                <Text style={{padding: 5, fontFamily}}>{this.state.text}</Text>

            </View>
        )
    }
}


const mapStateToProps = state => ({
});

const bindActions = dispatch => ({
});

export default connect(mapStateToProps, bindActions)(Page1);

