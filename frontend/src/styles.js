import { StyleSheet } from 'react-native';

//Platform.OS: ios, android, web
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  rowItem: {
    backgroundColor: '#803030'
  },
  appIntro: {
        flex: 3,
        fontSize: 30,
        textAlign: "center"
    }
});

export default styles;
