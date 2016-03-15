const SET_LAYOUTS_FILTER = 'SET_LAYOUTS_FILTER'

const reducers = {
  layouts: LayoutsReducer
}

const actions = {
  [ SET_LAYOUTS_FILTER ]: (payload) => {
    return { type: SET_LAYOUTS_FILTER, payload }
  }
}

const initialState = {
  filters: { }
}

function LayoutsReducer (state = initialState, {type, payload}) {
  switch(type) {
    case SET_LAYOUTS_FILTER:
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
