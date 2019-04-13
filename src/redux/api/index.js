
export const mock_api = !!process.env.REACT_APP_MOCK_API;

console.log("mock api:" + mock_api)
console.log(process.env)

const api = mock_api?require('./api_mock'):require('./api');

export const authenticate = api.authenticate
export const validate_token = api.validate_token
export const getPeople = api.getPeople

export const getNotes = api.getNotes
export const getNoteContent = api.getNoteContent
export const saveNote = api.saveNote
export const deleteNote = api.deleteNote

export const fsGetPath = api.fsGetPath

export const env = api.env