import React from 'react';
import { Platform } from 'react-native';
import pathToRegexp from 'path-to-regexp';

import { connect } from "react-redux";
import { initLocation, pushLocation } from "../redux/actions/routeAction";

function matchPath(str_regex, str) {
    var keys = [];
    var re = pathToRegexp(str_regex, keys);
    var arr = str.match(re);

    if (arr === null) {
        return null;
    }

    // unpack named arguments
    var obj = {}
    for (var i = 1; i < arr.length && (i-1) < keys.length; i++) {
        obj[keys[i-1].name] = arr[i]
    }
    return obj
}

const mapStateToProps = state => ({
    location: state.route.location
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
        } else {
          this.props.initLocation("/")
        }
    }

    render() {
        return this.props.children;
    }
}

export const Router = ctor(IRouter);

class IRoute extends React.Component {

    render() {

        const match = matchPath(this.props.path, this.props.location)

        if (match === null) {
            return null;
        }

        var route = { route: {match: match, location: this.props.location} }

        const childrenWithProps = React.Children.map(
            this.props.children,
            child => React.isValidElement(child)?React.cloneElement(
                child, {route: route}):child
        );

        return (childrenWithProps);
    }
}

export const Route = ctor(IRoute);

class ISwitch extends React.Component {

    render() {

        for (var i=0; i < this.props.children.length; i++) {
            var child = this.props.children[i]
            if (React.isValidElement(child) && child.props.hasOwnProperty('path')) {

                var re = pathToRegexp(child.props.path);
                if (re.test(this.props.location)) {
                    return child
                }
            }
        }

        return null;
    }
}

export const Switch = ctor(ISwitch);
