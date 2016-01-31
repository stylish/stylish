const { assign, keys } = Object

const SHOW_LOCK = 'SHOW_LOCK'
const RECEIVE_LOCK_TOKEN = 'RECEIVE_LOCK_TOKEN'
const RECEIVE_LOCK_ERROR = 'RECEIVE_LOCK_ERROR'

const constants = {
  SHOW_LOCK,
  RECEIVE_LOCK_TOKEN,
  RECEIVE_LOCK_ERROR
}

function showLock() {
	return {
		type: SHOW_LOCK,
		payload: {
			lockVisible: true
		}
	}
}

function receiveLockToken ({ userToken }) {
  return {
    type: RECEIVE_LOCK_TOKEN,
    payload: {
      isAuthenticated: true,
      userToken
    }
  }
}

function receiveLockError (payload = {}) {
  return {
    type: RECEIVE_LOCK_ERROR,
    payload: {
      isAuthenticated: false,
      userToken: undefined
    }
  }
}

const initialState = {
	isAuthenticated: false,
  userToken: localStorage.getItem('userToken')
}

function reducer (state = initialState, action = {type, payload}) {
  switch (type) {
    case RECEIVE_LOCK_TOKEN:
      return assign(state, payload)
    default:
      return state
  }
}

const actions = { showLock, receiveLockToken, receiveLockError }

module.exports = { initialState, reducer, actions }
