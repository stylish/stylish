import React, { Component, PropTypes as types } from 'react'
import FluidLayout from 'ui/layouts/FluidLayout'
import BasicFluidLayout from 'ui/layouts/BasicFluidLayout'
import IconNavLayout from 'ui/layouts/IconNavLayout'

import stateful from '../applications/util/stateful'

import pick from 'lodash/pick'

const layouts = {
  fluid: FluidLayout,
  iconNav: IconNavLayout,
  icon: IconNavLayout,
  basicFluid: BasicFluidLayout
}

export class DefaultLayout extends Component {
  static displayName = 'DefaultLayout';

  render () {
    const { settings } = this.props
    const { app } = settings

    const layoutComponent = app && app.defaultLayout
      ? layouts[app.defaultLayout] || IconNavLayout
      : IconNavLayout

    return React.createElement(
      layoutComponent,
      {
        settings
      },
      this.props.children
    )
  }
}

export default stateful(DefaultLayout, 'settings')
