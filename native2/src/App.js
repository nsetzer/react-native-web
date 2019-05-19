
import React from 'react';
import ShareMenu from 'react-native-share-menu';
import { Provider, connect } from 'react-redux';
import store from './redux/configureStore';

import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';

import { Router, Route, Switch, NavMenu } from './common/components/Route'
import { AuthenticatedComponent, NotAuthenticatedComponent} from './common/components/Auth'

import {SvgNowPlaying, SvgLibrary, SvgNotes, SvgStorage, SvgSettings, SvgLogout} from './common/components/svg'

import {env, libraryDomainInfo} from './common/api'


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


const boxWidth = 15;

export class TreeLeaf extends React.Component {

    selectChild(key, state=null) {
        console.log("select leaf: " + key)
        this.props.selectChild(key)
    }

    render() {

        // TODO: danger zone - react internals
        const nodeKey = this._reactInternalFiber.key;
        const isSelected = this.props.isSelected(nodeKey)
        const bgcolor = isSelected?'#257AFD':null

        return (
            <View style={{flex:1, flexDirection: 'row', alignItems: 'center', paddingTop: 5}}>
                <TouchableOpacity onPress={()=>{this.selectChild(nodeKey)}}
                    style={{paddingRight: 5}}>
                    <View style={{width: boxWidth, height: boxWidth, backgroundColor:'blue'}}></View>
                </TouchableOpacity>

                <Text style={{backgroundColor: bgcolor, flexGrow: 1}}>{this.props.data.title}</Text>
            </View>
        )
    }

}

export class TreeSubCard extends React.Component {

    constructor(props) {
        super(props);
    }

    selectChild(key, state=null) {
        var nextState = {}
        var selected = (state===null)?(!this.props.isSelected(key)):state;
        nextState[key] = selected
        console.log("leaf:" + selected + ':'+  JSON.stringify(nextState))
        this.fixSelection(nextState)
    }

    selectParent(key) {
        var nextState = {}
        var selected = !this.props.isSelected(key)
        nextState[key] = selected
        this._selectParent(nextState, selected, key, this.props.data)
        console.log("+++" + selected + '::' + JSON.stringify(Object.keys(nextState)))
        this.fixSelection(nextState)
    }

    _selectParent(nextState, selected, parentKey, data) {
        var keys = Object.keys(data)
        for (var i=0; i < keys.length; i++) {
            var childKey = parentKey + '_' + i.toString()
            nextState[childKey] = selected
        }
    }

    fixSelection(nextState) {

        // TODO: danger zone - react internals
        const nodeKey = this._reactInternalFiber.key;

        var keys = Object.keys(this.props.data)
        var selected = keys.length > 0;
        for (var i=0; i < keys.length; i++) {
            var childKey = nodeKey + '_' + i.toString()
            if (nextState[childKey] !== undefined) {
                if (!nextState[childKey]) {
                    selected = false;
                    break;
                }
            } else if (!this.props.isSelected(childKey)) {
                selected = false;
                break;
            }
        }
        nextState[nodeKey] = selected
        console.log("sub:" + selected+ ':'+  JSON.stringify(nextState))

        this.props.selectFix(nextState)
    }

    render() {

        // TODO: danger zone - react internals
        const nodeKey = this._reactInternalFiber.key;
        const isSelected = this.props.isSelected(nodeKey)
        const bgcolor = isSelected?'#257AFD':null

        return (


            <View style={{paddingTop: 5}}>

            <View style={{flex:1, flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={()=>{this.selectParent(nodeKey)}}
                    style={{paddingRight: 5}}>
                    <View style={{width: boxWidth, height: boxWidth,backgroundColor:'blue'}}></View>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{this.props.expandChild(nodeKey)}}
                    style={{backgroundColor: bgcolor,flexGrow: 1}}>
                    <Text >{this.props.title}</Text>
                </TouchableOpacity>
            </View>


            <View style={{marginLeft: boxWidth}}>
            {(this.props.isExpanded(nodeKey) && this.props.data)?
                this.props.data.map((item, index) => {
                    return (
                        <TreeLeaf
                            key={nodeKey + '_' + index.toString()}
                            selectChild={this.selectChild.bind(this)}
                            isSelected={this.props.isSelected}
                            data={item}
                        ></TreeLeaf>
                    )
            }):null}
            </View>
            </View>
        )
    }
}

export class TreeCard extends React.Component {

    constructor(props) {
        super(props);

    }

    selectParent(key) {
        var nextState = {}
        var selected = !this.props.isSelected(key)
        nextState[key] = selected
        this._selectParent(nextState, selected, key, this.props.data)
        console.log("+++" + selected + '::' + JSON.stringify(Object.keys(nextState)))
        this.fixSelection(nextState)
    }

    _selectParent(nextState, selected, parentKey, data) {
        var keys = Object.keys(data)
        for (var i=0; i < keys.length; i++) {
            var childKey = parentKey + '_' + i.toString()
            nextState[childKey] = selected

            const child = data[keys[i]]
            if (!Array.isArray(child)) {
                this._selectParent(nextState, selected, childKey, child)
            } else {
                for (var j=0; j < child.length; j++) {
                    var grandChildKey = childKey + '_' + j.toString()
                    nextState[grandChildKey] = selected
                }
            }
        }
    }

    fixSelection(nextState) {

        // TODO: danger zone - react internals
        const nodeKey = this._reactInternalFiber.key;

        var keys = Object.keys(this.props.data)
        var selected = keys.length > 0;
        for (var i=0; i < keys.length; i++) {
            var childKey = nodeKey + '_' + i.toString()
            if (nextState[childKey] !== undefined) {
                if (!nextState[childKey]) {
                    selected = false;
                    break;
                }
            } else if (!this.props.isSelected(childKey)) {
                selected = false;
                break;
            }
        }
        nextState[nodeKey] = selected

        this.props.selectFix(nextState)
    }

    render() {

        // TODO: danger zone - react internals
        const nodeKey = this._reactInternalFiber.key;
        const isSelected = this.props.isSelected(nodeKey)
        const bgcolor = isSelected?'#257AFD':null

        return (
            <View style={{padding: 5, marginLeft: 0}}>

            <View style={{flex:1, flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={()=>{this.selectParent(nodeKey)}}
                    style={{paddingRight: 5}}>
                    <View style={{width: boxWidth, height: boxWidth,backgroundColor:'blue'}}></View>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{this.props.expandChild(nodeKey)}}
                    style={{flexGrow: 1}}>
                    <Text style={{backgroundColor: bgcolor}}>{this.props.title}</Text>
                </TouchableOpacity>
            </View>

            <View style={{marginLeft: boxWidth}}>
            {(this.props.isExpanded(nodeKey) && this.props.data)?
                Object.keys(this.props.data).map((k, index) => {
                    return (<TreeSubCard
                            expandChild={this.props.expandChild}
                            isExpanded={this.props.isExpanded}
                            selectChild={this.props.selectChild}
                            selectFix={this.fixSelection.bind(this)}
                            isSelected={this.props.isSelected}
                            key={nodeKey + '_' + index.toString()}
                            title={k}
                            data={this.props.data[k]}>
                        </TreeSubCard>
                    )
            }):null}
            </View>

            </View>
        )
    }
}

export class ForestView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expansion: {},
            selected: {},
        }
    }

    expandChild(key, state=null) {
        // toggle by default
        // if second argument is given and not null expand or not
        const expansion = {...this.state.expansion}
        expansion[key] = (state===null)?!this.state.expansion[key]:state;
        this.setState({expansion})
    }

    isExpanded(key) {

        return !!this.state.expansion[key]
    }

    selectChild(key, state=null) {
        // toggle by default
        // if second argument is given and not null expand or not
        const selected = {...this.state.selected}
        selected[key] = (state===null)?!this.state.selected[key]:state;
        console.log("set selected: " + key + ": " + (selected[key]))
        console.log(JSON.stringify(selected))
        this.setState({selected})
    }

    fixSelection(nextState) {
        const selected = {...this.state.selected, ...nextState}
        console.log("root:" + JSON.stringify(selected))
        this.setState({selected})
    }

    isSelected(key) {
        //257AFD / Selected Blue
        return !!this.state.selected[key]
    }

    render() {

        return (
            <View>

            <TouchableOpacity onPress={()=>{this.onPress()}}>
                <Text>{env.baseUrl}</Text>
            </TouchableOpacity>

            {this.props.data?
                Object.keys(this.props.data).map((key, index) => {
                    return (<TreeCard
                            key={'n_' + index.toString()}
                            expandChild={this.expandChild.bind(this)}
                            isExpanded={this.isExpanded.bind(this)}
                            selectChild={this.selectChild.bind(this)}
                            selectFix={this.fixSelection.bind(this)}
                            isSelected={this.isSelected.bind(this)}
                            title={key}
                            data={this.props.data[key]}>
                        </TreeCard>
                    )
            }):<Text>error</Text>}

            <View style={{width: '100%', height: 100}}>
            </View>

            </View>
        )
    }
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

    getRoutes() {
        const navRoutes = [
            {
                route: '/u/queue',
                text: 'Now Playing',
                icon: {url: SvgNowPlaying, style: icon_style}
            },
            {
                text: 'Library',
                icon: {url: SvgLibrary, style: icon_style}
            },
            {
                route: '/u/p5',
                text: 'Storage',
                icon: {url: SvgStorage, style: icon_style}
            },
            {
                route: '/u/p4',
                text: 'Notes',
                icon: {url: SvgNotes, style: icon_style}
            },
            {
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
            <Provider store={store}>
            <View>
            <Router>


                <NavMenu
                    routes={this.getRoutes()}
                    visible={this.state.showMenu}
                    slimMode={this.state.slimMode}
                    hide={() => {this.setState({showMenu: false})}}>

                        <ScrollView>
                            <TouchableOpacity onPress={() => {this.onPress()}}>
                            <Text style={{padding: 10}}>Hello World1</Text>
                            <SharedText />
                            </TouchableOpacity>
                            <ForestView data={this.state.data}/>
                        </ScrollView>
                </NavMenu>

            </Router>
            </View>
            </Provider>
        );
    }
}
