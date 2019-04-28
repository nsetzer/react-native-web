


import {
    USER_STORAGE_FETCH,
} from '../constants'

export function userStorageFetch(root, path) {
    return {
        type: USER_STORAGE_FETCH,
        root: root,
        path: path,
    }
}