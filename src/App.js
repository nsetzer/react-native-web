import React from 'react';
import 'resize-observer-polyfill/dist/ResizeObserver.global'
import { View, StyleSheet } from 'react-native';

import { Router, Route, Switch } from './components/Route'
import { AuthenticatedComponent, NotAuthenticatedComponent} from './components/Auth'


import LoginPage from './pages/login'
import HomePage from './pages/home'
import MainPage from './pages/main'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const styles2 = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFCCCC',
        height: '100%',
        width: '100%'
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
                <Route name='app-switch' path='/'><HomePage /></Route>
            </Switch>
        </View>
        </Router>
        </ErrorBoundary>
      );
  }
}