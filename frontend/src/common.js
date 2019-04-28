

import {
    Platform,
    Alert,
} from 'react-native';

// this page documents what components react-native-web supports
// https://github.com/necolas/react-native-web#modules

// cross platform (web, ios, android) pop up alert
// title: the title text to display (android, ios)
// text: the text of the alert
export function showAlert(title, text) {
    if (Platform.OS === 'web') {
       alert(text)
    } else {
        Alert.alert(title, text)
    }
}