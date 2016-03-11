import invariant from 'invariant'

export function validate(props, App) {
  let { layout, screens, project } = props

  invariant(
    hasOwnProperty(project, 'requireEntryPoint') && hasOwnProperty(project, 'requireLayout'),
    'A Project bundle is required to dynamically find entry points and components'
  )

  invariant(
    ( hasOwnProperty(screens, 'index') || hasOwnProperty(screens, 'default') ),
    'The Application screens should define and "index" or "default" value'
  )

  invariant(
    layout && layout.length > 0,
    'Application settings failed to specify a root layout container'
  )

  values(screens).forEach(entryPointId => {
    invariant(
      project.validateRequireValue(entryPointId),
      `Attempt to find a screen component for ${ entryPointId } failed. e.g. require('entries/${ entryPointId }')`
    )
  })

  return props
}

export default validate

const { hasOwnProperty, values } = Object
