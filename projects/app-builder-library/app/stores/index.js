import thunk from 'redux-thunk'
import {build, reducers} from './reducers'

import {
  applyMiddleware,
  compose,
  createStore
} from 'redux'

export function configure (initialState = {}, reducers = {}) {
  const middleware = applyMiddleware(thunk)

  const createStoreWithMiddleware = compose(middleware)

  const rootReducer = build(reducers)

  const store = createStoreWithMiddleware(createStore)(
    rootReducer, initialState
  )

  return store
}
