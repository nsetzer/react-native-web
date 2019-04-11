

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
    var config = { withCredentials: true }
    return axios.post(url, body, config );
}

export function getNotes() {
}

export function getNoteContent(uid) {
}

export function saveNote(uid, title, content) {
}