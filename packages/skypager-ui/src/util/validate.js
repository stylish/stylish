import invariant from 'invariant'

export function validate(props, App) {
  let { layout, screens, project } = props

  project = project || props.bundle

  invariant(
    typeof project !== 'undefined',
    'Must supply a project bundle. These are generated with the skypager export bundle command'
  )

  invariant(
    typeof project.settings !== 'undefined',
    'The project must include a settings object'
  )

  screens = screens || project.settings.screens

  invariant(
    typeof screens === 'object',
    'Must specify screens in the app settings. This should be an object which references entry points, or components'
  )

  invariant(
    screens.index || screens.default,
    'The Application screens should define and "index" or "default" value'
  )

  invariant(
    typeof layout !== 'undefined',
    'Application settings failed to specify a root layout container'
  )

  return props
}

export default validate

const { hasOwnProperty, values } = Object
