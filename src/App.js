import React from 'react';
import 'resize-observer-polyfill/dist/ResizeObserver.global'
import { Text, View, Button } from 'react-native';

import styles from './styles'

import { Router, Route, Switch } from './components/Route'

import HeaderPage from './header'
import Page1 from './pages/page1'
import Page2 from './pages/page2'
import Page3 from './pages/page3'

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
        <View>
            <Switch>
                <Route path='/p1'><Page1 /></Route>
                <Route path='/p2'><Page2 /></Route>
                <Route path='/p3'><Page3 /></Route>
                <Route path='/:default*'><Text>Default1</Text></Route>
                <Route path='/'><Text>Default2</Text></Route>
            </Switch>
        </View>
        </Router>
        </ErrorBoundary>
      );
  }
}