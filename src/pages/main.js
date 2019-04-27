
import React from "react";
import { Animated, Platform, TouchableOpacity, View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView } from "react-native";
import { NavMenu, Router, Route, Switch } from '../components/Route'

import { connect } from "react-redux";

import { pushLocation } from "../redux/actions/routeAction";

import HeaderPage from './header'

import Modal from './modal'
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
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '100%'
  },
});

const navRoutes = [
    {
        route: '/u/queue',
        text: 'Now Playing'
    },
    {
        route: '/u/p5',
        text: 'Storage'
    },
    {
        route: '/u/p4',
        text: 'Notes'
    },
    {
        text: 'Settings'
    },
]

export class MainPage extends React.Component {


    constructor(props) {
        super(props);
        console.log("page main constructor")

        this.state = {
            showMenu: false,
            slimMode: false
        }
    }

    componentWillMount() {
        console.log("page main componentWillMount")
        if (Platform.OS === "web") {
            var showMenu = window.innerWidth >= 900
            var slimMode = window.innerWidth < 900
            this.setState({showMenu, slimMode})
        }
    }

    componentDidMount() {
        console.log("page main componentDidMount")
        if (Platform.OS === "web") {
            window.addEventListener("resize", this.onResize.bind(this));
        }
    }

    componentWillUnmount() {
        console.log("page main componentWillUnmount")

        if (Platform.OS === "web") {
            window.removeEventListener("resize", this.onResize);
        }
    }

    componentWillReceiveProps() {
        console.log("page main componentWillReceiveProps")
    }

    componentDidUpdate() {
        console.log("page main componentDidUpdate")
    }

    onResize() {

        var showMenu = window.innerWidth >= 900
        var slimMode = window.innerWidth < 900

        if (this.state.showMenu != showMenu) {
            this.setState({showMenu, slimMode})
        }
    }

    onToggle() {
        console.log("on toggle" + ((!this.state.showMenu)?'true':'false'))
        this.setState({showMenu: !this.state.showMenu})
    }

    render() {
        //  <View stickyHeaderIndices={[0]} contentContainerStyle={{ flex: 1 }}>
        //

        return (

            <View>

            {this.props.modalRenderFn?
                    <Modal render={this.props.modalRenderFn}></Modal>:
                    null}

            <NavMenu
                routes={navRoutes}
                visible={this.state.showMenu}
                slimMode={this.state.slimMode}
                hide={() => {this.setState({showMenu: false})}}>

                <HeaderPage style={{
                    position: 'fixed',
                    top: 0,
                    left: (!this.state.slimMode)?300:0,
                    //backgroundColor: '#FF00FF',
                    backgroundColor: '#406f9d',
                    zIndex: 20,
                    right: 0,
                    height: 100,
                    borderBottomWidth: 1,
                    borderBottomColor: '#000000',
                    shadowOffset: {  width: 0,  height: 2,  },
                    shadowColor: '#000000',
                    shadowOpacity: 0.5,
                    shadowRadius: 2,
                }} showMenu={!this.state.showMenu}
                toggle={this.onToggle.bind(this)}/>



                <View style={{
                    backgroundColor: '#FFFF0033',
                    width: '100%',
                    height: 100
                }}></View>

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
            </NavMenu>
            </View>

        )
    }
}


const mapStateToProps = state => ({
    modalRenderFn: state.modal.render
});

const bindActions = dispatch => ({
});

export default connect(mapStateToProps, bindActions)(MainPage);

