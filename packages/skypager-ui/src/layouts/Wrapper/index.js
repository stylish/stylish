import React, { Component, PropTypes as types } from 'react'
import FluidLayout from 'ui/layouts/IconNavLayout'
import stateful from 'ui/util/stateful'

import pick from 'lodash/pick'

export class Wrapper extends Component {
  static displayName = 'Wrapper';

  render () {
    const { settings } = pick(this.props, 'navigation', 'app', 'branding');

    const layoutProps = assign({}, settings, settings.layout || {} )

    return (
      <FluidLayout {...layoutProps} >
        {this.props.children}
      </FluidLayout>
    )
  }
}

export default stateful(Wrapper, 'settings')

const { assign } = Object
