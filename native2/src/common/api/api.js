

import axios from 'axios';

import { serialize } from './common'

import { Platform } from 'react-native';

export const env = {baseUrl: ''}

if (Platform.OS === 'web') {
    if (process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "dev" ||
        process.env.NODE_ENV === "test") {
        env.baseUrl = "http://" + window.location.hostname + ":4200"
    } else {
        env.baseUrl = ""
    }
} else {
    if (process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "dev" ||
        process.env.NODE_ENV === "test") {
        // Note: replace with the host address running the development server
        env.baseUrl = "http://192.168.1.149:4200"
    } else {
        // Note: replace with the host address of the production server
        env.baseUrl = "https://yueapp.duckdns.org"
    }
}

if (process.env.REACT_APP_BACKEND_PATH) {
    env.baseUrl = process.env.REACT_APP_BACKEND_PATH
}

var _axiosConfig = {withCredentials: true, auth: {username: "admin", password: 'admin'}}

export function setAxiosConfig(config, baseUrl=null) {
    _axiosConfig = config
    if (!!baseUrl) {
        env.baseUrl = baseUrl
    }
}

export function authConfig() {
    if (Platform.OS === 'web') {
        const token = localStorage.getItem("user_token")
        return {withCredentials: true, headers: {Authorization: token}}
    } else {
        return _axiosConfig;
    }
    return config
}

export function getPeople() {
}

export function authenticate(email, password) {
    console.log(env.baseUrl + '/api/user/login')
    return axios.post(env.baseUrl + '/api/user/login', {
            email: email,
            password: password,
    });
}

export function validate_token(token) {
    var url = env.baseUrl + '/api/user/token'
    var body = { token, }
    return axios.post(url, body);
}

export function getNotes() {
    const url = env.baseUrl + '/api/fs/notes'
    const config = authConfig();
    return axios.get(url, config);
}

export function getNoteContent(uid) {
    const url = env.baseUrl + '/api/fs/notes/' + uid
    const config = authConfig();
    return axios.get(url, config);
}

export function saveNote(uid, content) {
    const url = env.baseUrl + '/api/fs/notes/' + uid
    const config = authConfig();
    return axios.post(url, content, config);
}

export function deleteNote(uid) {
    const url = env.baseUrl + '/api/fs/notes/' + uid
    const config = authConfig();
    config['headers']["Content-Type"] = "text/plain"
    return axios.delete(url, config);
}

export function fsGetPath(root, path) {
    const url = env.baseUrl + '/api/fs/' + root +'/path/' + path
    const config = authConfig();
    return axios.get(url, config);
}

export function librarySearch(query, limit=500, page=0, orderby='artist') {

    const url = env.baseUrl + '/api/library' + serialize({query, limit, page, orderby})
    console.log(url)
    const config = authConfig();
    return axios.get(url, config);
}

export function libraryGetSong(song_id) {
    const url = env.baseUrl + '/api/library/' + song_id
    const config = authConfig();
    return axios.get(url, config);
}

export function libraryDomainInfo() {
    const url = env.baseUrl + '/api/library/info'
    const config = authConfig();
    return axios.get(url, config);
}

export function historyIncrementPlaycount(song_id) {
    var url = env.baseUrl + '/api/library/history/increment'
    var body = [song_id, ]
    const config = authConfig();
    return axios.post(url, body, config);
}

export function queueGetSongs() {
    const url = env.baseUrl + '/api/queue'
    const config = authConfig();
    return axios.get(url, config);
}

export function queuePopulate() {
    const url = env.baseUrl + '/api/queue/populate'
    const config = authConfig();
    return axios.get(url, config);
}

export function queueCreate(query) {
    const url = env.baseUrl + '/api/queue/create' + serialize({query})
    const config = authConfig();
    return axios.get(url, config);
}

export function storageGeneratePublicUri(root, path) {
    const url = env.baseUrl + '/api/fs/public/' + root +'/path/' + path
    const config = authConfig();
    return axios.put(url, null, config);
}

export function storageRevokePublicUri(root, path) {
    const url = env.baseUrl + '/api/fs/public/' + root +'/path/' + path + serialize({revoke: true})
    const config = authConfig();
    return axios.put(url, null, config);
}

export function storagePublicFileInfo(file_id) {
    const url = env.baseUrl + '/api/fs/public/' + file_id + serialize({info: true})
    return axios.get(url);
}