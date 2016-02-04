import { PropTypes as types } from 'react'
import { connect } from 'react-redux'
import { pick } from 'lodash'

export default stateful

export function stateful (component, ...args) {
  let { stateProps } = parse(...args)

  let connected

  component.contextTypes = component.contextTypes || {}
  component.contextTypes.project = types.object.isRequired

  function  mapSelectedProps (state) {
    return pick(state, ...stateProps)
  }

  if (stateProps && stateProps.length > 0) {
    connected = connect( mapSelectedProps)(component)
  } else {
    connected = connect(...args)(component)
  }

  connected.contextTypes.project = types.object.isRequired

  return connected
}

function parse(...args) {
  let options = {}

  if (args.length > 0 && args.every(a => typeof a === 'string')) {
    options.stateProps = args
  }

  return options
}


const { assign, keys } = Object
