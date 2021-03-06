/*

Example:

App:
    a sample router that supports multiple pages and authenication

    render:
        <Router>
            <Switch redirect='/'>
                <Route auth path='/u/:path*'><MainPage/></Route>
                <Route path='/login'><LoginPage/></Route>
                <Route path='/'><HomePage/></Route>
            </Switch>
        </Router>

MainPage:
    content changes depending on whether the route is
        /u/profile
        /u/settings
    this is done by forwarding a partial match from a parent route

    render:
        <SubSwitch location={this.props.route.match.path} redirect='/u/profile'>
            <SubRoute path="profile"><ProfilePage /></SubRoute>
            <SubRoute path="settings"><SettingsPage /></SubRoute>
        </SubSwitch>
*/
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Platform,
    BackHandler,
    Animated,
    KeyboardAvoidingView,
    View,
    TouchableOpacity,
    Text,
    TouchableWithoutFeedback,
} from 'react-native';

import { connect } from "react-redux";

//import {Svg, SvgMore} from './svg'

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  navItem: {
    padding: 10,
  },
});

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

// https://facebook.github.io/react-native/docs/backhandler.html

// todo, allow pushing a location into a switch component
// to allow for nested routes
// a parent route matches on
//      /a/b/:rest*
// a child can only see and only matches on 'rest' as it is passed
// in from a parent


// location.split('/'')
// /       => ^\/$
// /a      => ^\/a\/?$
// /:name  => ^\/([^\/]+)\/?$
// /:name+ => ^\/(.+)\/?$
// /:name* => ^\/(.*)\/?$
// /:name? => ^\/([^\/]*)?\/?$


// pattern: a location string used to match URLs
// returns a function (map) => string
// which constructs a valid URL
// matching the given pattern using a dictionary argument to
// fill in named groups
export function patternCompile(pattern) {
    const arr = pattern.split('/')

    var tokens=[]

    for (var i=1; i < arr.length; i++) {

        var part = arr[i]

        if (part.startsWith(':')) {
            if (part.endsWith('?')) {
                tokens.push({param: true, name: part.substr(1, part.length-2)})
            } else if (part.endsWith('+')) {
                tokens.push({param: true, name: part.substr(1, part.length-2)})
            } else if (part.endsWith('*')) {
                tokens.push({param: true, name: part.substr(1, part.length-2)})
            } else {
                tokens.push({param: true, name: part.substr(1)})
            }
        } else {
            tokens.push({param: false, value: part})
        }

    }

    return items => {
        var location = '';
        for (var i=0; i < tokens.length; i++) {
            location += '/'
            if (tokens[i].param) {
                location += items[tokens[i].name]
            } else {
                location += tokens[i].value
            }
        }
        return location;
    }
}

// pattern: a location string used to match URLs
// returns an object which can be used for matching strings
// exact match :  /abc
// named group :  /:name
// zero or one :  /:name?
// one or more :  /:name+
// zero or more:  /:name*

export function patternToRegexp(pattern) {
    // TODO: optional exact parameter
    // when false remove the initial \\/
    // will be used for SubSwitch SubRoute
    const arr = pattern.split('/')

    var re = "^"

    var tokens=[]

    for (var i=1; i < arr.length; i++) {
        re += "\\/"

        var part = arr[i]

        if (part.startsWith(':')) {

            if (part.endsWith('?')) {
                tokens.push(part.substr(1, part.length-2))
                re += "([^\\/]*)"
            } else if (part.endsWith('+')) {
                tokens.push(part.substr(1, part.length-2))
                re += "(.+)"
            } else if (part.endsWith('*')) {
                tokens.push(part.substr(1, part.length-2))
                re += "(.*)"
            } else {
                tokens.push(part.substr(1))
                re += "([^\\/]+)"
            }

        } else {
            re += part
        }

    }

    if (re !== "^\\/") {
        re += "\\/?"
    }

    re += "$"

    return {re: new RegExp(re, "i"), tokens}
}

export function locationMatch(obj, location) {

    // reset this regex object if it has
    // been used before
    obj.re.lastIndex = 0

    var arr = location.match(obj.re)

    if (arr == null) {
        return null;
    }

    var result = {}
    for (var i=1; i < arr.length; i++) {
        result[obj.tokens[i-1]] = arr[i]
    }

    return result;
}

export function patternMatch(pattern, location) {
    return locationMatch(patternToRegexp(pattern), location)
}

const mapStateToProps = state => ({
    initialized: state.route.initialized,
    location: state.route.location,
    authenticated: state.route.authenticated
});

const bindActions = dispatch => ({
    pushLocation: (location) => {
        dispatch(pushLocation(location))
    },
    initLocation: (location) => {
        dispatch(initLocation(location))
    }
});

const ctor = connect(mapStateToProps, bindActions);

class IRouter extends React.Component {

    constructor(props) {
      super(props);
        if (Platform.OS === 'web') {
          this.props.initLocation(window.location.pathname)
          // register a function to handle back button events
          // use initLocation to avoid pushing another state
          window.onpopstate = (state) => {
            // state contains the source and target location
            this.props.initLocation(window.location.pathname);
          };
        } else {
          this.props.initLocation("/")
        }
    }

    componentDidMount() {
        //if (Platform.OS === 'android') {
        //    BackHandler.addEventListener('hardwareBackPress',
        //        this.handleBackPress);
        //}
    }

    componentWillUnmount() {
        //if (Platform.OS === 'android') {
        //    BackHandler.removeEventListener('hardwareBackPress',
        //        this.handleBackPress);
        //}
    }

    handleBackPress = () => {

        console.log('pop location')
        // this.props.popLocation();
        // return false if history is empty

        return true;
    }

    render() {
        return this.props.children;
    }
}

export const Router = ctor(IRouter);

/**
 * props:
 *   auth: boolean. require authentication to render this route
 *   path: location pattern:
 *      path components are matched using `path-to-regexp` syntax
 *          named arg      /:path
 *          zero or one    /:path?
 *          one or more    /:path+
 *          zero or more   /:path*
 *
 */
class IRoute extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        re: patternToRegexp(this.props.path)
      }

    }
    render() {

        // do not render the Component Children if authentication
        // is required and the router has not been authenticated
        const msg = (this.props.name || 'undefined') + " | " + this.props.path  + " | " + this.props.location

        const v1 = this.props.auth || false
        const v2 = !this.props.authenticated
        if (v1 && v2) {
            return null
        }

        const match = patternMatch(this.props.path, this.props.location)

        if (match === null) {
            return null;
        }

        var route = { route: {match: match, location: this.props.location} }

        const childrenWithProps = React.Children.map(
            this.props.children,
            child => React.isValidElement(child)?React.cloneElement(
                child, route):child
        );

        // React.createElement(this.props.component, {route: route})
        return (childrenWithProps);
    }
}

export const Route = ctor(IRoute);

/**
 * props:
 *   redirect: location string. if none or the route children match
 *             force a redirect to the given location. default to '/'
 *
 *   Note a default route needs to be created to avoid a redirect
 */
class ISwitch extends React.Component {

    render() {

        if (!this.props.initialized) {
            return null
        }

        if (!this.props.location) {
            return null
        }

        for (var i=0; i < this.props.children.length; i++) {
            var child = this.props.children[i]
            if (React.isValidElement(child) && child.props.hasOwnProperty('path')) {

                // check to see if the child requires authentication
                // if i does and this is not authenticated, skip to the
                // next route child
                const v1 = child.props.auth || false
                const v2 = !this.props.authenticated
                if (v1 && v2) {
                    continue;
                }

                // TODO: only compute match once
                // compute path match, and push props downward
                // use a _computed flag to prevent the child
                // from recomputing the match
                var match = patternMatch(child.props.path, this.props.location);
                if (match !== null) {
                    return child
                }
            }
        }


        // Render can be run prior to the props being initialized
        // which can cause an invalid redirect
        if (this.props.initialized) {
            const location = this.props.redirect || '/'
            console.log("Redirect to location: " + location)
            this.props.pushLocation(location)
        }
        return null;
    }
}

export const Switch = ctor(ISwitch);

const platformPosition = (Platform.OS === 'web')?'fixed':'absolute'

class INavMenu extends React.Component {
    // props:
    //   visible: whether to hide or show the menu. triggers an animation
    //   complete(visible): function called when transition finishes

    // todo: enhance NavMenu to  render child props
    //      - have this class calculate slim mode by itself
    //      - render children components in a view which correctly
    //        sets the margin
    //      - callback to emit state (fixed-position or drawer)
    //      - add prop to pass in the list of objects to render
    //      - add render prop for a function to render an object
    //      - then move this component into the router file

    constructor(props) {
        super(props);

        this.state = {
            position: new Animated.Value(-300),  // Initial value for opacity: 0
            visible: false,
            slimMode: false
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.visible != prevState.visible) {
          Animated.timing(
            prevState.position,
            {
              toValue: nextProps.visible?0:-300,
              duration: (!nextProps.slimMode||!prevState.slimMode)?0:325,
            }
          ).start(() => {nextProps.complete && nextProps.complete(nextProps.visible)});
        }
      return {visible: nextProps.visible, slimMode: nextProps.slimMode}
    }

    onPress(obj) {
        if (obj.route) {
            this.props.pushLocation(obj.route)
            if (this.props.hide && this.props.slimMode) {
                this.props.hide()
            }
        } else if (obj.callback) {
            obj.callback()
        }
    }

    render () {
        // TODO: look for a way to eliminate zIndex
        // or make the zIndex passed in with a prop

        const style = this.props.style;
        const zIndex = (style?(style.zIndex?style.zIndex:20):20)
        const backgroundColor = (style?(style.backgroundColor?style.backgroundColor:'white'):'white')

        // order of components is important for RN on Android
        // and zIndex is ignored
        // zIndex required for web rendering
        return (
            <View>

            <View style={{
                marginLeft: (!this.state.slimMode)?300:0,
                zIndex: zIndex / 2,
                }}>
                {this.props.children}
            </View>

            {
                (this.props.visible&&this.props.slimMode)?
                <TouchableWithoutFeedback onPress={() => {this.props.hide && this.props.hide()}}>
                    <View style={{
                        position: platformPosition,
                        top: 0,
                        left: 0,
                        zIndex: zIndex - 1,
                        height: ScreenHeight,
                        width: ScreenWidth,
                        backgroundColor: '#00000088'}}>
                    </View>
                </TouchableWithoutFeedback>
                :null
            }

            <Animated.View style={{
                zIndex: zIndex,
                position: platformPosition,
                width: 300,
                height: ScreenHeight,
                top: 0,
                left: this.state.position,
                backgroundColor: backgroundColor,
                borderRightColor: 'black',
                borderRightWidth:1}}>

                <View style={{
                    top: 0,
                    bottom: 0,
                    zIndex: zIndex,
                    backgroundColor: backgroundColor}}>

                    <View style={{height: 100}}></View>
                    {this.props.routes.map((obj, index) => {
                        return <TouchableOpacity key={index.toString()}style={{marginLeft: 10, marginBottom: 15}} onPress={() => this.onPress(obj)}>
                                <Text style={styles.navItem}>{obj.text}</Text>
                               </TouchableOpacity>
                        })
                    }
                </View>
            </Animated.View>


            </View>
        )
    }
}

export const NavMenu = ctor(INavMenu);

export const ROUTE_INIT_ACTION = 'ROUTE_INIT_ACTION'
export const ROUTE_PUSH_ACTION = 'ROUTE_PUSH_ACTION'

// set the current location, without effecting browser history

export const initLocation = location => {
    return {
      type: ROUTE_INIT_ACTION,
      payload: location
    }
}

// push a location
// for a web platform, push onto the browser history as well
// for a mobile platform, push onto the mobile history
// to support the use of the back button

export const pushLocation = location => {
    return {
      type: ROUTE_PUSH_ACTION,
      payload: location
    }
}

const INITIAL_STATE = {
    'initialized': false,
    'location': '/',
    history: []
}

export function routeReducer(state = INITIAL_STATE, action = {}) {
    switch(action.type) {
        case ROUTE_INIT_ACTION:
            console.log("init:" + action.payload);
            return {
                ...state,
                initialized: true,
                location: action.payload,
            }
        case ROUTE_PUSH_ACTION:

            if (Platform.OS === 'web') {
                window.history.pushState(null, '', action.payload);
            } else {
                // PUSH
                // [action.payload].concat(state.history).slice(0, MAX_LENGTH)
                // POP
                // state.history.slice(1, MAX_LENGTH)
            }
            console.log("push:" + action.payload);
            return {
                ...state,
                location: action.payload,
          }
        default:
            return state
    }
}