import { StyleSheet } from 'react-native';

//Platform.OS: ios, android, web
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  rowItem: {
    backgroundColor: '#803030'
  }
});

export default styles;
