
import React from 'react';
import ShareMenu from 'react-native-share-menu';
import { Provider, connect } from 'react-redux';
import store from './redux/configureStore';

import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';

import { Router, Route, Switch, NavMenu } from './common/components/Route'
import { AuthenticatedComponent, NotAuthenticatedComponent} from './common/components/Auth'
import { ForestView } from './common/components/ForestView'


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

const mapStateToProps = state => ({
});

const bindActions = dispatch => ({
});

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
            data: {
                a0: {
                    b0: [{ title: "a0-b0", }],
                    b1: [{ title: "a0-b1", }],
                    b2: [{ title: "a0-b2", }],
                },
                a1: {
                    b0: [{ title: "a1-b0-0", }, { title: "a1-b0-1", }, { title: "a1-b0-2", }],
                    b1: [{ title: "a1-b1-0", }, { title: "a1-b1-1", }, { title: "a1-b1-2", }],
                    b2: [{ title: "a1-b2-0", }, { title: "a1-b2-1", }, { title: "a1-b2-2", }],
                },
                a2: {
                    b0: [{ title: "a2-b0", }],
                    b1: [{ title: "a2-b1", }],
                    b2: [{ title: "a2-b2", }],
                },
                a3: {
                    b0: [{ title: "a3-b0-0", }, { title: "a3-b0-1", }, { title: "a3-b0-2", }],
                    b1: [{ title: "a3-b1-0", }, { title: "a3-b1-1", }, { title: "a3-b1-2", }],
                    b2: [{ title: "a3-b2-0", }, { title: "a3-b2-1", }, { title: "a3-b2-2", }],
                },
            }
        }
    }

    render() {

        /*
        <ScrollView>
            <TouchableOpacity onPress={() => {this.onPress()}}>
            <Text style={{padding: 10}}>Hello World1</Text>
            <SharedText />
            </TouchableOpacity>
            <ForestView data={this.state.data}/>
        </ScrollView>
             <Switch redirect='/'>
                    <Route name='app-switch' path='/:path*'   ><LoginPage  /></Route>
                    <Route name='app-switch' path='/u/:path*' ><MainPage    /></Route>
                </Switch>
        */
        return (
            <Provider store={store}>
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
