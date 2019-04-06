import React from 'react';
import 'resize-observer-polyfill/dist/ResizeObserver.global'
import { Platform, Text, View, Button } from 'react-native';

import styles from './styles'

import { Router, Route, Switch } from './components/Route'

import HeaderPage from './header'

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

export default class App extends React.Component {
  render() {
      return (
        <ErrorBoundary>
        <Router>
        <HeaderPage />
        <View style={styles.container}>
        <Switch>
            <Route path='/p1'><Text> Page 1</Text></Route>
            <Route path='/p2'><Text> Page 2</Text></Route>
            <Route path='/p3'><Text> Page 3</Text></Route>
        </Switch>
        </View>
        </Router>
        </ErrorBoundary>
      );
  }
}