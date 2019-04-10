import { USER_NOTE_REQUEST_CONTENT, USER_NOTE_FETCH } from '../constants'

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
