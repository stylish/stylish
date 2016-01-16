export function navLinks (state = window.ProjectSnapshot.navLinks, action) {
  const { type, payload } = action

  if (type === 'REFRESH_CONTENT') {
    return Object.assign({}, state, payload)
  }

  return state
}

export default navLinks
