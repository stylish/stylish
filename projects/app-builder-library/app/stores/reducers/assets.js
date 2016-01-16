const snapshot = window.ProjectSnapshot.assets

export function assets(state = snapshot, action) {
  const { type, payload } = action

  if (type === 'REFRESH_ASSETS') {
    return Object.assign({}, state, payload)
  }

  return state
}

export default assets
