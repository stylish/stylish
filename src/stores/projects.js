import bundle from 'dist/bundle'

export function projects (state, action = {}) {
  if (!state) { state = bundle.entities.projects }

  const { type, payload } = action

  return state
}

export default projects
