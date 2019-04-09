
import React from "react";
import { View, Text, Button } from "react-native";

import { connect } from "react-redux";
import { setAuthenticated, pushLocation, initLocation } from '../redux/actions/routeAction'
import { Switch, Route } from '../components/Route'

export class Page3 extends React.Component {

    constructor(props) {
        super(props);
        console.log("page 3 constructor")
    }

    componentWillMount() {
        console.log("page 1 componentWillMount")
    }

    componentDidMount() {
        console.log("page 3 componentDidMount")
    }

    componentWillUnmount() {
        console.log("page 3 componentWillUnmount")
    }

    componentWillReceiveProps() {
        console.log("page 3 componentWillReceiveProps")
    }

    componentDidUpdate() {
        console.log("page 3 componentDidUpdate")
    }

    render() {
      // , this.props.setAuthenticated(!this.props.authenticated)
        return (
            <View>

                <Text>Redux Examples</Text>
                <Button
                    title="Log Out"
                    onPress={() => this.props.setAuthenticated(false)}
                />

                <Button
                    title="Log In"
                    onPress={() => this.props.setAuthenticated(true)}
                />

                <Text>User Is{this.props.authenticated?"":" Not"} Authenticated </Text>
                <Text>---</Text>
                <Switch>
                  <Route auth path='/u/p3'><Text>User Is Authenticated</Text></Route>
                  <Route path='/u/p3'><Text>User Is Not Authenticated</Text></Route>
                </Switch>
            </View>
        )
    }
}


function mapStateToProps (state) {
  return {
    authenticated: state.route.authenticated
  }
}


const bindActions = dispatch => ({
    setAuthenticated: (authenticated) => {
        dispatch(setAuthenticated(authenticated))
    },
    pushLocation: (location) => {
        dispatch(pushLocation(location))
    },
    initLocation: (location) => {
        dispatch(initLocation(location))
    }
});
export default connect(mapStateToProps, bindActions)(Page3);

