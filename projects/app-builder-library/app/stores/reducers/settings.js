let snapshot = window.ProjectSnapshot.settings || {}

export function settings (state = snapshot, action = {}) {
  const { type, payload } = action

  if ( type === 'REFRESH_SETTINGS' ) {
    return Object.assign({}, state, payload)
  }

  return state
}

export default settings
