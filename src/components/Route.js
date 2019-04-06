import React from 'react';
import { Platform } from 'react-native';
import pathToRegexp from 'path-to-regexp';

import { connect } from "react-redux";
import { initLocation, pushLocation } from "../redux/actions/routeAction";

function matchPath(pattern, location) {
    var keys = [];
    var re = pathToRegexp(pattern, keys);
    var arr = location.match(re);

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

    render() {

        // do not render the Component Children if authentication
        // is required and the router has not been authenticated
        const v1 = this.props.auth || false
        const v2 = !this.props.authenticated
        if (v1 && v2) {
            return null
        }

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

/**
 * props:
 *   redirect: location string. if none or the route children match
 *             force a redirect to the given location. default to '/'
 *
 *   Note a default route needs to be created to avoid a redirect
 */
class ISwitch extends React.Component {

    render() {

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
                var re = pathToRegexp(child.props.path);
                if (re.test(this.props.location)) {
                    return child
                }
            }
        }

        const location = this.props.redirect || '/'
        console.log("Redirect to location: " + location)
        this.props.pushLocation(location)
        return null;
    }
}

export const Switch = ctor(ISwitch);
