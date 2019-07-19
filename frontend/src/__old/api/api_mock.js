
import axios from 'axios';

export const env = {baseUrl: ''}

const people = [
  { name: 'Nader', age: 36 },
  { name: 'Amanda', age: 24 },
  { name: 'Jason', age: 44 }
]

export function getPeople() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve(people)
    }, 500)
  })
}

// simulate server-side authentication
export function authenticate(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === password) {
         return resolve({data: {token: 'TEST_JWT_TOKEN'}})
      } else {
        reject(new Error('invalid username or password'))
      }
    }, 750)
  })
}

export function validate_token(token) {
    // NOTE: the timeout here simulates network lag
    // from validating the token, which produces
    // interesting results for rendering
    return new Promise((resolve, reject) => {
        setTimeout(() => {
         return resolve(token === 'TEST_JWT_TOKEN')
        }, 100)
    })
}


const notes = {
      'note000': {size: 0, mtime: 0, title: 'Grocery List'},
      'note001': {size: 0, mtime: 0, title: 'Favorite Color List'},
      'note002': {size: 0, mtime: 0, title: 'Favorite Animal List'},
      'note003': {size: 0, mtime: 0, title: 'Video Games List'},
      'note004': {size: 0, mtime: 0, title: 'TODO'},
      'note005': {size: 0, mtime: 0, title: 'Chapter1'},
      'note006': {size: 0, mtime: 0, title: 'TestNote1'},
      'note007': {size: 0, mtime: 0, title: 'TestNote2'},
      'note008': {size: 0, mtime: 0, title: 'TestNote3'},
      'note009': {size: 0, mtime: 0, title: 'TestNote4'},
      'note010': {size: 0, mtime: 0, title: 'TestNote5'},
}

const content = {
    'note000': {text: '1. eggs\n2. milk\n3. bread'},
    'note001': {text: '1. red\n2. blue\n3. green\n4.yellow\n5.purple'},
    'note002': {text: '1. dog\n2. cat\n3. parrot'},
    'note003': {text: '1. Zelda\n2. Mario\n3. Yoshi'},
    'note004': {text: 'do the laundry\nfile taxes'},
    'note005': {text: 'it was the best of times it was the blurst of times'},
    'note006': {text: 'line0\nline1\nline2\nline3\nline4\n'},
    'note007': {text: 'line0\nline1\nline2\nline3\nline4\n'},
    'note008': {text: 'line0\nline1\nline2\nline3\nline4\n'},
    'note009': {text: 'line0\nline1\nline2\nline3\nline4\n'},
    'note010': {text: 'line0\nline1\nline2\nline3\nline4\n'},
}

export function getNotes() {
    // NOTE: the timeout here simulates network lag
    // from validating the token, which produces
    // interesting results for rendering
    return new Promise((resolve, reject) => {
        setTimeout(() => {
         return resolve({data: {result: notes}})
        }, 500)
    })
}

export function getNoteContent(uid) {
    // NOTE: the timeout here simulates network lag
    // from validating the token, which produces
    // interesting results for rendering
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (uid in content) {
                return resolve({data: content[uid].text})
            } else {
                reject(new Error('content not found for note: ' + uid))
            }
        }, 500)
    })
}

export function saveNote(uid, title, content) {

  return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (notes[uid] !== undefined) {
                return resolve(true)
            } else {
                reject(new Error('content not found for note: ' + uid))
            }
        }, 750)
    })

}

export function deleteNote(uid) {
  return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (notes[uid] !== undefined) {
                delete notes[uid];
                delete content[uid];
                return resolve(true)
            } else {
                reject(new Error('content not found for note: ' + uid))
            }
        }, 750)
    })

}

const root_dir = {"result":{
  "directories": ["public", "private", "secure"],
  "files": [
    {
      "encryption":"system",
      "mtime":1552437649,
      "name":"sample1.png",
      "permission":0,
      "public":null,
      "size":444112,
      "version":1
    },
    {
      "encryption":"system",
      "mtime":1552437838,
      "name":"sample2.png",
      "permission":0,
      "public":null,
      "size":159599,
      "version":1
    },
    {
      "encryption":"system",
      "mtime":1552437838,
      "name":"sample3.png",
      "permission":0,
      "public":null,
      "size":159599,
      "version":1
    }
  ],
  "name":"default",
  "parent":"",
  "path":""
}}

const child_dir = {"result":{
  "directories": [],
  "files": [
    {
      "encryption":"system",
      "mtime":1552437649,
      "name":"sample4.png",
      "permission":0,
      "public":null,
      "size":444112,
      "version":1
    },
    {
      "encryption":"system",
      "mtime":1552437838,
      "name":"sample5.png",
      "permission":0,
      "public":null,
      "size":159599,
      "version":1
    },
    {
      "encryption":"system",
      "mtime":1552437838,
      "name":"sample6.png",
      "permission":0,
      "public":null,
      "size":159599,
      "version":1
    }
  ],
  "name":"default",
  "parent":"",
  "path":""
}}

const url_map = {
  'sample1.png': 'https://picsum.photos/300/300',
  'sample2.png': 'https://picsum.photos/300/200',
  'sample3.png': 'https://picsum.photos/200/300',
  'sample4.png': 'https://picsum.photos/64/64',
  'sample5.png': 'https://picsum.photos/128/64',
  'sample6.png': 'https://picsum.photos/64/128',
}

export function fsGetPath(root, path) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({data: root_dir})
        },
        750)})
}


export function libraryGetSong(song_id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({})
        },
        200)})
}

export function libraryDomainInfo() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({})
        },
        200)})
}

export function queueGetSongs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({})
        },
        200)})
}

export function queuePopulate() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({})
        },
        200)})
}