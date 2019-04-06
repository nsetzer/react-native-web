
import React from "react";
import { View, Text, TextInput, ScrollView } from "react-native";

import styles from '../styles'
import { connect } from "react-redux";
import { exampleAction } from "../redux/actions/exampleAction";

export class Page1 extends React.Component {
    render() {

        return (
            <ScrollView>

                <Text>Redux Examples</Text>

                <Text style={styles.appIntro}>{"\n"}</Text>
                <Text style={styles.appIntroText}>{this.props.example.text || 'Enter Example Text Below to Modify the Redux Store'}</Text>
                <Text style={styles.appIntro}>{"\n"}</Text>

                <TextInput
                    style={{height: 100, width: '100%', borderColor: 'gray', borderWidth: 1}}
                    onChangeText={((text) => {
                        this.props.exampleAction(text)
                    }).bind(this)}
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

            </ScrollView>
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

