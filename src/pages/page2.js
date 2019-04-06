
import React from "react";
import { View, Text, Button } from "react-native";

import styles from '../styles'
import { connect } from "react-redux";
import { fetchData } from '../redux/actions/dataAction'

export class Page2 extends React.Component {
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

