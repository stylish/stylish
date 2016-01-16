export function content(state = window.ProjectSnapshot.content, action) {
  const { type, payload } = action

  if (type === 'REFRESH_CONTENT') {
    return Object.assign({}, state, payload)
  }

  return state
}

export default content
