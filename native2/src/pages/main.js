

import React from 'react';
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

import { Router, Route, Switch, NavMenu, pushLocation } from '../common/components/Route'

import {
    SvgNowPlaying,
    SvgLibrary,
    SvgNotes,
    SvgStorage,
    SvgSettings,
    SvgLogout
} from '../common/components/svg'

import LibraryPage from './library'
import NotesPage from './notes'
import NowPlayingPage from './nowplaying'
import StoragePage from './storage'
import SettingsPage from './settings'
import QueuePage from './queue'

const icon_style = {
    width: 48,
    height: 48,
}

class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{backgroundColor: '#335588', height:32, width: '100%'}}>

            <TouchableOpacity onPress={() => {this.props.onPress()}}>
            <Text>Menu</Text>
            </TouchableOpacity>
            </View>

        );
    }
}

class MainPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showMenu: false,
            slimMode: true,
        }
    }

    getRoutes() {
        const navRoutes = [
            {
                route: '/u/nowplaying',
                text: 'Now Playing',
                icon: {url: SvgNowPlaying, style: icon_style}
            },
            {
                route: '/u/queue',
                text: 'Song Queue',
                icon: {url: SvgNowPlaying, style: icon_style}
            },
            {
                route: '/u/library',
                text: 'Library',
                icon: {url: SvgLibrary, style: icon_style}
            },
            {
                route: '/u/storage',
                text: 'Storage',
                icon: {url: SvgStorage, style: icon_style}
            },
            {
                text: 'File System',
                icon: {url: SvgStorage, style: icon_style}
            },
            {
                route: '/u/notes',
                text: 'Notes',
                icon: {url: SvgNotes, style: icon_style}
            },
            {
                route: '/u/settings',
                text: 'Settings',
                icon: {url: SvgSettings, style: icon_style}
            },
            {
                text: 'Log Out',
                icon: {url: SvgLogout, style: icon_style},
                callback: this.onLogout.bind(this),
            },
        ]

        return navRoutes
    }

    onPress() {
        this.setState({showMenu: !this.state.showMenu})
        console.log("setting state")
    }

    onLogout() {

        //this.props.clearAuthToken()
        //this.props.pushLocation('/')
    }

    render() {
        return (
            <NavMenu
                routes={this.getRoutes()}
                visible={this.state.showMenu}
                slimMode={this.state.slimMode}
                hide={() => {this.setState({showMenu: false})}}>
                    <ScrollView
                        stickyHeaderIndices={[0]}
                        showsVerticalScrollIndicator={false}>
                        <Header onPress={this.onPress.bind(this)}/>

                        <Switch redirect='/u/nowplaying'>
                            <Route name='main-switch' path='/u/nowplaying'><NowPlayingPage/></Route>
                            <Route name='main-switch' path='/u/queue'     ><QueuePage     /></Route>
                            <Route name='main-switch' path='/u/library'   ><LibraryPage   /></Route>
                            <Route name='main-switch' path='/u/storage'   ><StoragePage   /></Route>
                            <Route name='main-switch' path='/u/notes'     ><NotesPage     /></Route>
                            <Route name='main-switch' path='/u/settings'  ><SettingsPage  /></Route>
                        </Switch>
                    </ScrollView>
            </NavMenu>
        );
    }
}

const mapStateToProps = state => ({
});

const bindActions = dispatch => ({
});

export default connect(mapStateToProps, bindActions)(MainPage);
