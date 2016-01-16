import { handleActions, createAction } from 'redux-actions'

const snapshot = window.ProjectSnapshot.entities

export const SET_INTEGRATIONS_FILTER = 'SET_INTEGRATIONS_FILTER'

export const setIntegrationsFilter = createAction(SET_INTEGRATIONS_FILTER, (filters = {}) => {
  return filters
})

export const actions = {
  setIntegrationsFilter
}

export const initialState = {
  visible: Object.keys(snapshot.integrations),
  filters: {
    category: '',
    name: '',
    platform_mobile: true,
    platform_server: true,
    platform_web: true
  }
}

export function integrations (state = initialState, action) {
  if (action.type === SET_INTEGRATIONS_FILTER) {
    return Object.assign({}, state, {
      filters: action.payload,
      visible: applyFilters(action.payload)
    })
  }

  return state
}

export default integrations

function applyFilters(filters) {
  return AppStore.getState().entities.cache.integrations.filter(e => {
    let match = true

    if (filters.name.length >= 2 && !fuzzyMatch(e.name, filters.name)) {
      match = false
    }

    if (filters.platform_web === false && e.platforms.browser) { match = false }
    if (filters.platform_mobile === false && e.platforms.mobile) { match = false }
    if (filters.platform_server === false && e.platforms.server) { match = false }

    if (filters.category.length > 0) {
      match = e.categories.indexOf(filters.category) >= 0
    }

    return match

  }).map(i => i.id)
}

function fuzzyMatch(str,pattern,flags='i'){
    pattern = pattern.split("").reduce(function(a,b){ return a+".*"+b; });
    return (new RegExp(pattern, flags)).test(str);
};
