import { PropTypes as types } from 'react'
import { connect } from 'react-redux'

import get from 'lodash/get'

export default stateful

export function stateful (component, ...args) {
  let { stateProps } = parse(...args)

  let connected

  component.contextTypes = component.contextTypes || {}
  component.contextTypes.project = types.object.isRequired

  function  mapSelectedProps (state) {
    return stateProps.reduce((memo,prop) => {
      let p = prop.split('.')
      let propName = p[ p.length - 1 ]
      memo[propName] = get(state, prop)

      return memo
    }, {})
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
