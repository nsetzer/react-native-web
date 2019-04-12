

import axios from 'axios';

const env = {baseUrl: ''}

if (process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "dev" ||
    process.env.NODE_ENV === "test") {
    env.baseUrl = "http://localhost:4200"
} else {
    env.baseUrl = ""
}

if (process.env.REACT_APP_BACKEND_PATH) {
    env.baseUrl = process.env.REACT_APP_BACKEND_PATH
}

function authConfig() {
    const token = localStorage.getItem("user_token")
    const config = {withCredentials: true, headers: {Authorization: token}}
    return config
}

export function getPeople() {
}

export function authenticate(email, password) {
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