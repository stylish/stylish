import { handleActions, createAction } from 'redux-actions'

const snapshot = window.ProjectSnapshot.entities

export const SET_RESOURCES_FILTER = 'SET_RESOURCES_FILTER'

export const setResourcesFilter = createAction(SET_RESOURCES_FILTER, (filters = {}) => {
  return filters
})

export const actions = {
  setResourcesFilter
}

export const initialState = {
  visible: Object.keys(snapshot.resources),
  filters: {
    category: '',
    name: ''
  }
}

export function resources (state = initialState, action) {
  if (action.type === SET_RESOURCES_FILTER) {
    return Object.assign({}, state, {
      filters: action.payload,
      visible: applyFilters(action.payload)
    })
  }

  return state
}

export default resources

function applyFilters(filters) {
  return AppStore.getState().entities.cache.resources.filter(e => {
    let match = true

    if (filters.name.length >= 2 && !fuzzyMatch(e.name, filters.name)) {
      match = false
    }

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
