import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';

import CheckBox from './CheckBox'

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

class _Node extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const item = this.props.data

        if (this.props.visible) {
            return (


                <View style={{flex:1, flexDirection: 'row', paddingLeft: this.props.data.depth * boxWidth, width: '100%'}}>

                    <TouchableOpacity
                        onPress={()=>{this.props.expandChildren(item)}}
                        style={{paddingRight: 5}}
                    >
                        <View style={{width: boxWidth, height: boxWidth,backgroundColor:'blue'}}></View>
                    </TouchableOpacity>

                    <Text>{this.props.data.title}</Text>
                </View>
            )
        }
        return null
    }

}

export default class ForestView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: {},
            selected: {},
        }
    }

    createNode(key, item, depth, title, parent) {
        var obj = {key, item, depth, title, parent, children: []}
        obj.addChildIndex = (index) => {obj.children.push(index)}
        return obj
    }

    _expandChildren(item, state=null) {
        // toggle by default
        // if second argument is given and not null expand or not

        const visible = {...this.state.visible}
        item.children.map((index)=>{
            var child = this.props.data[index]
            visible[child.key] = (state===null)?!this.state.visible[child.key]:state
        })
        console.log(visible)
        this.setState({visible})
    }

    _fixSelection(item) {

    }

    itemKeyExtractor = (item, index) => item.key;

    itemRenderItem = ({item, index}) => (
        <_Node
            key={item.key}
            index={index}
            data={item}
            expandChildren={this._expandChildren.bind(this)}
            fixSelection={this._fixSelection.bind(this)}
            visible={item.depth===0 || this.state.visible[item.key]}
            />
    );

    render() {

        return (
            <View style={{width: '100%'}}>

            <FlatList
                data={this.props.data}
                extraData={this.state}
                keyExtractor={this.itemKeyExtractor}
                renderItem={this.itemRenderItem.bind(this)}
                ListFooterComponent={ForestFooter}
                />

            </View>
        )
    }
}