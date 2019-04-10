
import React from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { Router, Route, Switch } from '../components/Route'

import styles from '../styles'
import { connect } from "react-redux";

import HeaderPage from './header'

import Page1 from './page1'
import Page2 from './page2'
import Page3 from './page3'
import Page4 from './page4'

export class MainPage extends React.Component {


    constructor(props) {
        super(props);
        console.log("page main constructor")
    }

    componentWillMount() {
        console.log("page main componentWillMount")
    }

    componentDidMount() {
        console.log("page main componentDidMount")
    }

    componentWillUnmount() {
        console.log("page main componentWillUnmount")
    }

    componentWillReceiveProps() {
        console.log("page main componentWillReceiveProps")
    }

    componentDidUpdate() {
        console.log("page main componentDidUpdate")
    }


    render() {

        return (
            <ScrollView stickyHeaderIndices={[0]}>
                <HeaderPage />

                <Switch redirect='/u/p1'>
                    <Route name='main-switch' path='/u/p1'><Page1/></Route>
                    <Route name='main-switch' path='/u/p2'><Page2/></Route>
                    <Route name='main-switch' path='/u/p3'><Page3/></Route>
                    <Route name='main-switch' path='/u/p4'><Page4/></Route>
                </Switch>
            </ScrollView>
        )
    }
}


const mapStateToProps = state => ({
});

const bindActions = dispatch => ({
});

export default connect(mapStateToProps, bindActions)(MainPage);

