import Application from './Application'

let lock

class LockedApplication extends Application {
  static create (options = {}) {
    options.defer = true
    let render = Application.create(options)

    if (!lock && options.lock) {
      lock = new Auth0Lock(options.lock.clientId, options.lock.clientDomain)
    }

    doLogin().then(cacheToken).then(render)
  }
}

function cacheToken (result) {
  localStorage.setItem('userToken', result.user_id)
  localStorage.setItem('userProfile', JSON.stringify(result))

  return result.user_id
}

export function getProfile (token) {
  token = token || localStorage.getItem('userToken')

  return new Promise((resolve,reject)=> {
    lock.getProfile(token, (err, result) => {
      return err ? reject(err) : resolve(result)
    })
  })
}

export function doLogin() {
  return new Promise((resolve, reject) => {
    if (!lock) {
       console.error('could not get lock. did you configure auth0?')
       reject('could not get access to auth0 lock; did you configure it?')
       return
    }

    lock.show((err, result) => {
      if(err) {
        reject(err)
        return;
      }

      resolve(result)
    })
  })
}
