const snapshot = window.ProjectSnapshot.entities

export function entities(state = snapshot, action) {
  let { payload, type } = action

  if (type === 'REFRESH_ENTITIES') {
    return Object.assign({}, state, payload)
  }

  return state
}

export default entities
