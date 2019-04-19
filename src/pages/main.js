
import React from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { Router, Route, Switch } from '../components/Route'

import { connect } from "react-redux";

import HeaderPage from './header'

import Page1 from './page1'
import Page2 from './page2'
import Page3 from './page3'
import Page4 from './page4'
import Page4Edit from './page4edit'
import Page5 from './page5'
import QueuePage from './queue'

const styles = StyleSheet.create({
  container: {
    height: '100%',
  }
});

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
            <ScrollView stickyHeaderIndices={[0]} contentContainerStyle={{ flex: 1 }}>
                <HeaderPage/>

                <Switch redirect='/u/p1'>
                    <Route name='main-switch' path='/u/p1'><Page1/></Route>
                    <Route name='main-switch' path='/u/p2'><Page2/></Route>
                    <Route name='main-switch' path='/u/p3'><Page3/></Route>
                    <Route name='main-switch' path='/u/p4'><Page4/></Route>
                    <Route name='main-switch' path='/u/p4/:uid'><Page4Edit/></Route>
                    <Route name='main-switch' path='/u/p5'><Page5/></Route>
                    <Route name='main-switch' path='/u/p5/:root'><Page5/></Route>
                    <Route name='main-switch' path='/u/p5/:root/:path*'><Page5/></Route>
                    <Route name='main-switch' path='/u/queue'><QueuePage/></Route>
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

