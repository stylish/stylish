import React, { Component, PropTypes as types } from 'react'
import FluidLayout from 'ui/layouts/FluidLayout'
import IconNavLayout from 'ui/layouts/IconNavLayout'

import stateful from '../applications/util/stateful'

import pick from 'lodash/pick'

export class DefaultLayout extends Component {
  static displayName = 'DefaultLayout';

  render () {
    const { settings } = this.props

    const { branding, navigation, app } = settings

    const layoutComponent = IconNavLayout

    const layoutProps = {
      ...(settings.layout || {}),
      branding,
      navigation
    }

    return React.createElement(
      layoutComponent,
      layoutProps,
      this.props.children
    )
  }
}

export default stateful(DefaultLayout, 'settings')
