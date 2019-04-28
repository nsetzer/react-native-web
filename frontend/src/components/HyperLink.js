import React from 'react';
import {
  Linking,
  Text,
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  title: {
    color: '#acacac',
    fontWeight: 'bold'
  }
});

export default class HyperLink extends React.Component {

  constructor(){
      super();
      this._goToURL = this._goToURL.bind(this);
  }

  render() {

    const { title} = this.props;

    return(
      <Text style={styles.title} onPress={this._goToURL}>{title}</Text>
    );
  }

  _goToURL() {
    const { url } = this.props;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(this.props.url);
      } else {
        console.log('Don\'t know how to open URI: ' + this.props.url);
      }
    });
  }
}
