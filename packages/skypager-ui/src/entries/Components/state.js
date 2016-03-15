const SET_COMPONENTS_FILTER = 'SET_COMPONENTS_FILTER'

const reducers = {
  components: ComponentsReducer
}

const actions = {
  [ SET_COMPONENTS_FILTER ]: (payload) => {
    return { type: SET_COMPONENTS_FILTER, payload }
  }
}

const initialState = {
  filters: { }
}

function ComponentsReducer (state = initialState, {type, payload}) {
  switch(type) {
    case SET_COMPONENTS_FILTER:
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
