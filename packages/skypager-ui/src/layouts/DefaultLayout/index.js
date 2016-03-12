import React, { Component, PropTypes as types } from 'react'
import FluidLayout from 'ui/layouts/FluidLayout'
import BasicFluidLayout from 'ui/layouts/BasicFluidLayout'
import IconNavLayout from 'ui/layouts/IconNavLayout'

import stateful from 'ui/util/stateful'

import pick from 'lodash/pick'

const layouts = {
  fluid: FluidLayout,
  iconNav: IconNavLayout,
  icon: IconNavLayout,
  basicFluid: BasicFluidLayout,
  basic: BasicFluidLayout
}

export class DefaultLayout extends Component {
  static displayName = 'DefaultLayout';

  render () {
    const { settings } = this.props

    console.log('default layout', settings)

    const layoutComponent = settings.layout && layouts[settings.layout]
      ? layouts[settings.layout]
      : BasicFluidLayout

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
