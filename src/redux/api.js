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