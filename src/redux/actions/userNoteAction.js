import {
    USER_NOTE_REQUEST_CONTENT,
    USER_NOTE_FETCH,
    USER_NOTE_SAVE,
    USER_NOTE_DELETE
} from '../constants'

export function userNoteFetch() {
    return {
        type: USER_NOTE_FETCH,
    }
}

export function userNoteRequestContent(note_id) {
    return {
        type: USER_NOTE_REQUEST_CONTENT,
        uid: note_id,
    }
}

export function userNoteSave(note_id, title, content, success_redirect=null) {
    return {
        type: USER_NOTE_SAVE,
        uid: note_id,
        title,
        content,
        success_redirect
    }
}

export function userNoteDelete(note_id) {
    return {
        type: USER_NOTE_DELETE,
        uid: note_id,
    }
}
