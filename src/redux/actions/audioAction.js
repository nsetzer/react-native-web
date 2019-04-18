import {
    AUDIO_LOAD_DOMAIN,
    AUDIO_POPULATE_QUEUE,
    AUDIO_LOAD_QUEUE,
    AUDIO_PLAY_SONG,
    AUDIO_NEXT_SONG,
    AUDIO_PREV_SONG,
} from '../constants'

export function audioLoadDomain() {
    return {
        type: AUDIO_LOAD_DOMAIN,
    }
}

export function audioPopulateQueue() {
    return {
        type: AUDIO_POPULATE_QUEUE,
    }
}

export function audioLoadQueue() {
    return {
        type: AUDIO_LOAD_QUEUE,
    }
}

export function audioPlaySong(index) {
    return {
        type: AUDIO_PLAY_SONG,
        index: index
    }
}

export function audioNextSong() {
    return {
        type: AUDIO_NEXT_SONG,
    }
}

export function audioPrevSong() {
    return {
        type: AUDIO_PREV_SONG,
    }
}