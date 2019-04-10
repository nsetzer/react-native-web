
// todo: Floating Action Button / round TouchableOpacity

import React from "react";
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";

import { connect } from "react-redux";
import { setAuthenticated, pushLocation, initLocation } from '../redux/actions/routeAction'
import { Switch, Route } from '../components/Route'

const styles = StyleSheet.create({
  listItemContainer: {
    padding: 10,
    borderColor: '#000000',
    borderWidth: 1,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: "#FFFFFF",
    shadowOffset: {  width: 4,  height: 4,  },
    shadowColor: '#000000',
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  titleContainer: {
    borderBottomColor: '#000000',
    borderBottomWidth: 2,
  },
  summaryContainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  footer: {
    height: 100,
    width: '100%',
    backgroundColor: "rgba(200, 0, 0, .3)"
  }
});


class ListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const textColor = this.props.selected ? 'red' : 'black';
    return (
        <View style={styles.listItemContainer}>
            <TouchableOpacity onPress={this._onPress}>
                <View style={styles.titleContainer}>
                    <Text style={{color: textColor}}>{this.props.title}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.summaryContainer}>
            <Text>{this.props.summary}</Text>
            </View>
        </View>
    );
  }
}

class ListFooter extends React.PureComponent {
  render() {
    return (<View style={styles.footer}></View>)
  }
}

export class Page4 extends React.Component {

    constructor(props) {
        super(props);
        console.log("page 4 constructor")

        this.state = {
            note_list: [],
            selected: {},
        }
    }

    componentDidMount() {
        console.log("page 4 componentDidMount")
    }

    componentWillUnmount() {
        console.log("page 4 componentWillUnmount")
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // sort the lists by their name
        const note_list = Object.keys(
            nextProps.notes).sort((a, b) =>
                nextProps.notes[a].localeCompare(nextProps.notes[b]))
        // conditionally update the state
        if (note_list != prevState.note_list) {
            return {note_list: note_list}
        }

        // no state change
        return null;
    }

    keyExtractor = (item, index) => item;

    onPressItem = (id) => {
        // updater functions are preferred for transactional updates
        this.setState((state) => {
        // copy the map rather than modifying state.
        const value = (!state.selected[id])
        const selected = {};
        selected[id] = value
        return {selected};
        });
    };

    renderItem = ({item}) => (
        <ListItem
            id={item}
            title={this.props.notes[item]}
            summary={this.props.summary[item]}
            onPressItem={this.onPressItem}
            selected={!!this.state.selected[item]}
        ></ListItem>
    );

    render() {
        return (
            <View>


            <FlatList
                data={this.state.note_list}
                extraData={this.state}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem.bind(this)}
                ListFooterComponent={ListFooter}
                />
            </View>
        )
    }
}


function mapStateToProps (state) {
  return {
    authenticated: state.route.authenticated,
    notes: state.userNote.notes,
    content: state.userNote.content,
    summary: state.userNote.summary,
  }
}


const bindActions = dispatch => ({
    setAuthenticated: (authenticated) => {
        dispatch(setAuthenticated(authenticated))
    },
    pushLocation: (location) => {
        dispatch(pushLocation(location))
    },
    initLocation: (location) => {
        dispatch(initLocation(location))
    }
});
export default connect(mapStateToProps, bindActions)(Page4);

