import { connect } from 'react-redux'
import { pick } from 'lodash'

export default stateful

export function stateful (component, ...args) {
  let { stateProps, dispatchers, fn } = parse(...args)

  if (stateProps && !dispatchers && !fn) {
    return connect((state) => pick(state, ...stateProps))(component)
  }

  throw('Implement other method signatures')
}

function parse(...args) {
  let options = {}

  if (args.length > 0 && args.every(a => typeof a === 'string')) {
    options.stateProps = args
  }

  return options
}

const { keys } = Object
