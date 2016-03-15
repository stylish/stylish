const SET_SHELLS_FILTER = 'SET_SHELLS_FILTER'

const reducers = {
  shells: ShellsReducer
}

const actions = {
  [ SET_SHELLS_FILTER ]: (payload) => {
    return { type: SET_SHELLS_FILTER, payload }
  }
}

const initialState = {
  filters: { }
}

function ShellsReducer (state = initialState, {type, payload}) {
  switch(type) {
    case SET_SHELLS_FILTER:
      return assign(state, {
        filter: payload.filter
      })

    default:
      return state
  }
}

export default {
  reducers,
  actions,
  initialState,
  get constants() {
     return Object.keys(actions)
  }
}
