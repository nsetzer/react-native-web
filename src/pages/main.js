
import React from "react";
import { Animated, Platform, TouchableOpacity, View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Router, Route, Switch } from '../components/Route'

import { connect } from "react-redux";

import { pushLocation } from "../redux/actions/routeAction";

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
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '100%'
  },
  fixedMenu: {
    position: 'fixed',
    width: 300,
    top: 0,
    left: 0
  },
  navText: {
    padding: 10
  }
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


class INavMenu extends React.Component {
    // props:
    //   visible: whether to hide or show the menu. triggers an animation
    //   complete(visible): function called when transition finishes

    constructor(props) {
        super(props);

        this.state = {
            position: new Animated.Value(-300),  // Initial value for opacity: 0
            visible: false
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.visible != prevState.visible) {
          Animated.timing(
            prevState.position,
            {
              toValue: nextProps.visible?0:-300,
              duration: (!nextProps.slimMode)?0:325,
            }
          ).start(() => {nextProps.complete && nextProps.complete(nextProps.visible)});
        }
      return {visible: nextProps.visible}
    }

    onPress(obj) {
        if (obj.route) {
            this.props.pushLocation(obj.route)
            if (this.props.hide && this.props.slimMode) {
                this.props.hide()
            }
        }
    }

    render () {
        return (
            <Animated.View style={{
                zIndex: 25,
                position: 'fixed',
                width: 300,
                top: 0,
                left: this.state.position,
                bottom: 0,
                backgroundColor: 'white',
                borderRightColor: 'black',
                borderRightWidth:1
            }}>

            {(this.props.visible&&this.props.slimMode)?

            <TouchableOpacity onPress={() => {this.props.hide && this.props.hide()}}>
            <View style={{position: 'fixed',
                    top: 0,
                    zIndex: 20,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "#00000033"
            }}></View></TouchableOpacity>:null}

            <View style={{width: '100%', height: '100%', zIndex: 25, backgroundColor: 'white'}}>
            {navRoutes.map((obj) => {
                return <TouchableOpacity onPress={() => this.onPress(obj)}>
                    <Text style={styles.navText}>{obj.text}</Text>
                </TouchableOpacity>
            })
            }
            </View>

            </Animated.View>
        )
    }
}

const navMapStateToProps = state => ({
});

const navBindActions = dispatch => ({
    pushLocation: (location) => {
        dispatch(pushLocation(location))
    }
});

const NavMenu = connect(navMapStateToProps, navBindActions)(INavMenu);

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
            <KeyboardAvoidingView>

            <NavMenu
                visible={this.state.showMenu}
                slimMode={this.state.slimMode}
                hide={() => {this.setState({showMenu: false})}}/>

            <View style={{
                position: 'fixed',
                top: 0,
                left: (!this.state.slimMode)?300:0,
                backgroundColor: '#FF00FF33',
                zIndex: 20,
                right: 0,
                height: 100,
                borderBottomWidth: 4,
                borderBottomColor: '#000000',
            }}><HeaderPage toggle={this.onToggle.bind(this)}/></View>

            <View style={{
                marginLeft: (!this.state.slimMode)?300:0,
                }}>

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
            </View>
            </KeyboardAvoidingView>
        )
    }
}


const mapStateToProps = state => ({
});

const bindActions = dispatch => ({
});

export default connect(mapStateToProps, bindActions)(MainPage);

