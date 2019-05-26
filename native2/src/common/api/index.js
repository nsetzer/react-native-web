
import blob from './blob'

export const mock_api = !!process.env.REACT_APP_MOCK_API;

const api = mock_api?require('./api_mock'):require('./api');

export const env = api.env

export const setAxiosConfig = api.setAxiosConfig

export const authenticate = api.authenticate
export const validate_token = api.validate_token
export const getPeople = api.getPeople

export const getNotes = api.getNotes
export const getNoteContent = api.getNoteContent
export const saveNote = api.saveNote
export const deleteNote = api.deleteNote

export const fsGetPath = api.fsGetPath

export const librarySearch = api.librarySearch
export const libraryGetSong = api.libraryGetSong
export const libraryDomainInfo = api.libraryDomainInfo
export const historyIncrementPlaycount = api.historyIncrementPlaycount
export const queueGetSongs = api.queueGetSongs
export const queuePopulate = api.queuePopulate
export const queueCreate = api.queueCreate

export const storageGeneratePublicUri = api.storageGeneratePublicUri
export const storageRevokePublicUri = api.storageRevokePublicUri
export const storagePublicFileInfo = api.storagePublicFileInfo

// ---------------------------------------

export const downloadFile = blob.downloadFile
export const uploadFile = blob.uploadFile
export const dirs = blob.dirs

//