const snapshot = window.ProjectSnapshot.html || {}

export function html(state = snapshot, action) {
  const { type, payload } = action

  if (type == 'REFRESH_HTML') {
    return Object.assign({}, state, payload)
  }

  return state
}

export default html
