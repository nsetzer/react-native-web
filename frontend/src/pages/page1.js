
import React from "react";
import { Text, TextInput, View } from "react-native";

import styles from '../styles'
import { connect } from "react-redux";
import { exampleAction } from "../redux/actions/exampleAction";

export class Page1 extends React.Component {


    constructor(props) {
        super(props);
        console.log("page 1 constructor")
    }

    componentWillMount() {
        console.log("page 1 componentWillMount")
    }

    componentDidMount() {
        console.log("page 1 componentDidMount")
    }

    componentWillUnmount() {
        console.log("page 1 componentWillUnmount")
    }

    componentWillReceiveProps() {
        console.log("page 1 componentWillReceiveProps")
    }

    componentDidUpdate() {
        console.log("page 1 componentDidUpdate")
    }

    render() {

        return (
            <View>

                <Text>Redux Examples</Text>

                <Text style={styles.appIntro}>{"\n"}</Text>
                <Text style={styles.appIntroText}>{this.props.example.text || 'Enter Example Text Below to Modify the Redux Store'}</Text>
                <Text style={styles.appIntro}>{"\n"}</Text>

                <TextInput
                    style={{height: 100, width: '100%', borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => {
                        this.props.exampleAction(text)
                    }}
                />

                <Text>
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                    {"\n"} new line
                </Text>

            </View>
        )
    }
}


const mapStateToProps = state => ({
    example: state.example
});

const bindActions = dispatch => ({
    exampleAction: (text) => {
        dispatch(exampleAction(text))
    }
});

export default connect(mapStateToProps, bindActions)(Page1);

