
import React from 'react';
import ShareMenu from 'react-native-share-menu';
import { Provider, connect } from 'react-redux';
import store from './redux/configureStore';

import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';

import { Router, Route, Switch, NavMenu } from './common/components/Route'
import { AuthenticatedComponent, NotAuthenticatedComponent} from './common/components/Auth'
import { ForestView } from './common/components/ForestView'

import { SqlDB } from './db'
import { AudioComponent } from './audio'

import {env, libraryDomainInfo} from './common/api'

import LoginPage from './pages/login'
import MainPage from './pages/main'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#FFCCCC',
        height: '100%',
        width: '100%',
    },
});

const icon_style = {
    width: 48,
    height: 48,
}

class SharedText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sharedText: null,
      sharedImage: null
    };
  }

  componentWillMount() {
    var that = this;
    ShareMenu.getSharedText((text :string) => {
      if (text && text.length) {
        if (text.startsWith('content://media/')) {
          that.setState({ sharedImage: text });
        } else {
          that.setState({ sharedText: text });
        }
      }
    })
  }

  render() {
    var text = this.state.sharedText;
    return (
      <View>
        <Text>Shared text: {this.state.sharedText}</Text>
        <Text>Shared image: {this.state.sharedImage}</Text>
      </View>
    );
  }
}

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showMenu: false,
            slimMode: true,
        }
    }


    render() {

        return (
            <Provider store={store}>
            <SqlDB/>
            <AudioComponent/>
            <View>
            <Router>

                <View style={{width: '100%', height: '100%'}}>

                <Switch redirect='/'>
                    <Route name='app-switch' path='/u/:path*' ><MainPage   /></Route>
                    <Route name='app-switch' path='/:path*'   ><LoginPage  /></Route>
                </Switch>


                </View>
            </Router>
            </View>
            </Provider>
        );
    }
}

