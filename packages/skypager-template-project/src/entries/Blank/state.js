const SET_THEMES_FILTER = 'SET_THEMES_FILTER'

const reducers = {
  themes: ThemesReducer
}

const actions = {
  [ SET_THEMES_FILTER ]: (payload) => {
    return { type: SET_THEMES_FILTER, payload }
  }
}

const initialState = {
  filters: { }
}

function ThemesReducer (state = initialState, {type, payload}) {
  switch(type) {
    case SET_THEMES_FILTER:
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
