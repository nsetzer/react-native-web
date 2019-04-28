
import React from "react";
import { View, Text, Button } from "react-native";

import { connect } from "react-redux";
import { fetchData } from '../redux/actions/dataAction'

export class Page2 extends React.Component {

    constructor(props) {
        super(props);
        console.log("page 2 constructor")
    }

    componentWillMount() {
        console.log("page 2 componentWillMount")
    }

    componentDidMount() {
        console.log("page 2 componentDidMount")
    }

    componentWillUnmount() {
        console.log("page 2 componentWillUnmount")
    }

    componentWillReceiveProps() {
        console.log("page 2 componentWillReceiveProps")
    }

    componentDidUpdate() {
        console.log("page 2 componentDidUpdate")
    }

    render() {
        return (
            <View>

                <Text>Redux Examples</Text>
                <Button
                    title='Load Data'
                    onPress={() => this.props.fetchData()}
                />
                <View>
                  {
                    this.props.appData.isFetching && <Text>Loading</Text>
                  }
                  {
                    this.props.appData.data.length ? (
                      this.props.appData.data.map((person, i) => {
                        return <View key={i} >
                          <Text>Name: {person.name}</Text>
                          <Text>Age: {person.age}</Text>
                        </View>
                      })
                    ) : null
                  }
                  </View>
            </View>
        )
    }
}

function mapStateToProps (state) {
  return {
    appData: state.appData
  }
}

function bindActions (dispatch) {
  return {
    fetchData: () => dispatch(fetchData())
  }
}
export default connect(mapStateToProps, bindActions)(Page2);

