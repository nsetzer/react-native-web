import React from "react";
import { View, Text, Button, StyleSheet, KeyboardAvoidingView, Image, TouchableOpacity } from "react-native";

import { connect } from "react-redux";
import { env, downloadFile, storagePublicFileInfo } from '../common/api'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#2c3e50',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginContainer:{
        alignItems: 'center',
        flexGrow: 1,
        width: '100%',
        justifyContent: 'center'
    },
    formContainer:{
        alignItems: 'center',
        flexGrow: 1,
        width: '100%',
        justifyContent: 'center'
    },
    logo: {
        position: 'absolute',
        width: 300,
        height: 100
    },
    title:{
        color: "#FFF",
        marginTop: 120,
        width: 180,
        textAlign: 'center',
        opacity: 0.9
    }
});

export class PublicFile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {file: null}
    }

    onDownload() {
        const url = env.baseUrl + '/api/fs/public/' + this.props.route.match.fileId + '/' + this.state.file.name

        downloadFile(url, {},
            (result) => {console.log(result);},
            (error) => {console.log(error);})
    }

    onPreview() {
        const url = env.baseUrl + '/api/fs/public/' + this.props.route.match.fileId + '/' + this.state.file.name + "?dl=0"
        var win = window.open(url, '_blank');
        win.focus();
    }

    componentDidMount() {
        storagePublicFileInfo(this.props.route.match.fileId).then(
            (result) => {this.setState({file: result.data.result.file})},
            (error) => {console.log(error)}
        )
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>

               <View style={styles.loginContainer}>
                    <Image resizeMode="contain" style={styles.logo} source={require('../common/assets/images/robot-dev.png')} />
               </View>
               <View style={styles.formContainer}>

                {this.state.file?
                    <TouchableOpacity onPress={() => this.onDownload()}>
                       <Text>Download: {this.state.file.name}</Text>
                    </TouchableOpacity>:
                    null}
                {this.state.file?
                    <TouchableOpacity onPress={() => this.onPreview()}>
                       <Text>Preview: {this.state.file.name}</Text>
                    </TouchableOpacity>:
                    null}
                <Text>Size: {this.state.file?this.state.file.size:''}</Text>
                <Text>Modified Date: {this.state.file?new Date(this.state.file.mtime*1000).toUTCString():''}</Text>

               </View>

            </KeyboardAvoidingView>
        );
    }
}

function mapStateToProps (state) {
  return {
  }
}

function bindActions (dispatch) {
  return {
  }
}
export default connect(mapStateToProps, bindActions)(PublicFile);

