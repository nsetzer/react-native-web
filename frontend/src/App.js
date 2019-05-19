import React from 'react';
import 'resize-observer-polyfill/dist/ResizeObserver.global'
import { View, StyleSheet, Text } from 'react-native';

import { Router, Route, Switch } from './common/components/Route'
import { AuthenticatedComponent, NotAuthenticatedComponent} from './common/components/Auth'


import LoginPage from './pages/login'
import HomePage from './pages/home'
import MainPage from './pages/main'
import PublicFilePage from './pages/public_file'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    console.log("updating state from error")
    return { hasError: true, error: error };
  }

  componentDidCatch(error, info) {
    console.log("did catch an error")
    console.error(error)
    this.setState({ hasError: true, error: error })
  }

  render() {
    if (this.state.hasError) {
      return (
        <View>
            <Text>Something went wrong.</Text>
            <Text>{JSON.stringify(this.state.error)}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles2 = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#FFCCCC',
        height: '100%',
        width: '100%',
    },
});

export default class App extends React.Component {
  render() {

      // TODO: investigate default route bug
      // a route "/" causes the login page to fail to render
      // a route "/:path*" allows the login page to render
      // two routes "/:path*" then "/" allows login page to render
      // Note: this may be a bug on calling the constructor after
      // a route change
      return (
        <ErrorBoundary>
        <Router>

        <View style={styles2.container}>
            <Switch redirect='/'>

                <Route name='app-switch' path='/login'>
                    <NotAuthenticatedComponent redirect='/u/p1'>
                        <LoginPage />
                    </NotAuthenticatedComponent>
                </Route>

                <Route name='app-switch' path='/u/:path*'>
                    <AuthenticatedComponent redirect='/login'>
                        <MainPage />
                    </AuthenticatedComponent>
                </Route>

                <Route name='app-switch' path='/p/:fileId'><PublicFilePage/></Route>
                <Route name='app-switch' path='/p/:fileId/:name'><PublicFilePage/></Route>

                <Route name='app-switch' path='/'><HomePage /></Route>
            </Switch>
        </View>
        </Router>
        </ErrorBoundary>
      );
  }
}