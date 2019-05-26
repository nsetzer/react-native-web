
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, FlatList, SectionList } from 'react-native';

import CheckBox from './CheckBox'

// todo selection mode CHECK or HIGHLIGHT

// TODO: version 2 render a single flat list
//       convert all data into a singular Object
//       {depth: <>, title: <>, item: <>, uid: <>, children: <>}
//       item only renders if expand is true
//       recursion is not required
//       children is a list of indices into the data of the children
//       children will always be an index greater than parents
//       non leaf items will have a null item
//       consider using section ist over flat list
//       https://facebook.github.io/react-native/docs/sectionlist

const boxWidth = 15;

const styles = StyleSheet.create({
    footer: {
        height: 100,
        width: '100%',
    },
});

class ForestFooter extends React.PureComponent {
  render() {
    return (<View style={styles.footer}></View>)
  }
}

export class TreeLeaf extends React.Component {

    selectChild(key, state=null) {
        this.props.selectChild(key)
    }

    render() {

        // TODO: danger zone - react internals
        const nodeKey = this._reactInternalFiber.key;
        const isSelected = this.props.isSelected(nodeKey)
        const bgcolor = isSelected?'#257AFD':null

        return (
            <View style={{flex:1, flexDirection: 'row', alignItems: 'center', paddingTop: 5}}>

                <View style={{width: boxWidth, height: boxWidth, backgroundColor:'blue', paddingRight: 5, }}></View>

                <CheckBox
                    style={{paddingRight: 5}}
                    onClick={()=>{this.selectChild(nodeKey)}}
                    isChecked={isSelected}
                />

                <TouchableOpacity onPress={()=>{this.selectChild(nodeKey)}}
                    style={{flexGrow: 1}}>
                <Text style={{backgroundColor: bgcolor, }}>{this.props.data.title}</Text>
                </TouchableOpacity>
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
        this.fixSelection(nextState)
    }

    selectParent(key) {
        var nextState = {}
        var selected = !this.props.isSelected(key)
        nextState[key] = selected
        this._selectParent(nextState, selected, key, this.props.data)
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
                <TouchableOpacity onPress={()=>{this.props.expandChild(nodeKey)}}
                    style={{paddingRight: 5}}>
                    <View style={{width: boxWidth, height: boxWidth,backgroundColor:'blue'}}></View>
                </TouchableOpacity>

                <CheckBox
                    style={{paddingRight: 5}}
                    onClick={()=>{this.selectParent(nodeKey)}}
                    isChecked={isSelected}
                />

                <TouchableOpacity onPress={()=>{this.selectParent(nodeKey)}}
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
                <TouchableOpacity onPress={()=>{this.props.expandChild(nodeKey)}}
                    style={{paddingRight: 5}}>
                    <View style={{width: boxWidth, height: boxWidth, backgroundColor:'blue'}}></View>
                </TouchableOpacity>

                <CheckBox
                    style={{paddingRight: 5}}
                    onClick={()=>{this.selectParent(nodeKey)}}
                    isChecked={isSelected}
                />

                <TouchableOpacity onPress={()=>{this.selectParent(nodeKey)}}
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

export default class ForestView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expansion: {},
            selected: {},
        }
    }

    _expandChild(key, state=null) {
        // toggle by default
        // if second argument is given and not null expand or not
        const expansion = {...this.state.expansion}
        expansion[key] = (state===null)?!this.state.expansion[key]:state;
        this.setState({expansion})
    }

    _isExpanded(key) {
        return !!this.state.expansion[key]
    }

    _selectChild(key, state=null) {
        // toggle by default
        // if second argument is given and not null expand or not
        const selected = {...this.state.selected}
        selected[key] = (state===null)?!this.state.selected[key]:state;
        this.setState({selected})
    }

    _fixSelection(nextState) {
        const selected = {...this.state.selected, ...nextState}
        this.setState({selected})
    }

    _isSelected(key) {
        //257AFD / Selected Blue
        return !!this.state.selected[key]
    }

    _setAllTrue(data, parentKey, attr) {
        if (Array.isArray(data)) {
            data.map((key, index) => {
                var k = parentKey + '_' + index.toString()
                attr[k] = true
            })
        } else {
            Object.keys(data).map((key, index) => {
                var k = parentKey + '_' + index.toString()
                attr[k] = true
                this._setAllTrue(data[key], k, attr)
            })
        }
    }

    // return all leaves that have their attr set to true
    _getAllTrue(data, parentKey, attr, result) {
        if (Array.isArray(data)) {
            data.map((leaf, index) => {
                var k = parentKey + '_' + index.toString()
                if (attr[k]) {
                    result.push(leaf)
                }
            })
        } else {
            // TODO: do the keys need to be .sort()
            // some keys use a different value for sorting than
            // are used for display. ES2015 guarantees insert order
            // is preserved
            Object.keys(data).map((key, index) => {
                var k = parentKey + '_' + index.toString()
                this._getAllTrue(data[key], k, attr, result)
            })
        }
    }

    async expandAll(bExpand) {
        const expansion = {}
        if (bExpand) {
            this._setAllTrue(this.props.data, 'n', expansion)
        }
        this.setState({expansion})
    }

    async expandToggle() {
        await this.expandAll(Object.keys(this.state.expansion).length == 0)
    }

    async selectAll(bSelect) {
        const selected = {}
        if (bSelect) {
            this._setAllTrue(this.props.data, 'n', selected)
        }
        this.setState({selected})
    }

    async selectToggle() {
        await this.selectAll(Object.keys(this.state.selected).length == 0)
    }

    async getSelection() {

        const selected = []
        this._getAllTrue(this.props.data, 'n', this.state.selected, selected)
        return selected
    }

    async setSelection(keys) {
        // TODO: requires itemKeyExtractor for leaf elements
        // TODO: requires fix selection for all tree roots
    }

    itemKeyExtractor = (key, index) => 'n_' + index.toString();

    itemRenderItem = ({item, index}) => (
        <TreeCard
            key={'n_' + index.toString()}
            title={item}
            expandChild={this._expandChild.bind(this)}
            isExpanded={this._isExpanded.bind(this)}
            selectChild={this._selectChild.bind(this)}
            selectFix={this._fixSelection.bind(this)}
            isSelected={this._isSelected.bind(this)}
            data={this.props.data[item]}>
        </TreeCard>
    );

    render() {

        return (
            <View style={{width: '100%'}}>

            <FlatList
                data={Object.keys(this.props.data)}
                extraData={this.state}
                keyExtractor={this.itemKeyExtractor}
                renderItem={this.itemRenderItem.bind(this)}
                ListFooterComponent={ForestFooter}
                />

            </View>
        )
    }
}