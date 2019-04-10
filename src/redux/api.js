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
         return resolve('TEST_JWT_TOKEN')
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
      'note000': 'Grocery List',
      'note001': 'Favorite Color List',
      'note002': 'Favorite Animal List',
      'note003': 'Video Games List',
      'note004': 'TODO',
      'note005': 'Chapter1',
      'note006': 'TestNote1',
      'note007': 'TestNote2',
      'note008': 'TestNote3',
      'note009': 'TestNote4',
      'note010': 'TestNote5',
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
         return resolve(notes)
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
                return resolve(content[uid].text)
            } else {
                reject(new Error('content not found for note: ' + uid))
            }
        }, 500)
    })
}