import React, { Component, PropTypes as types } from 'react'

import { stateful } from 'skypager-application'

import IconNavLayout from 'skypager-ui/src/layouts/IconNavLayout'

export class MainLayout extends Component {
  static displayName = 'MainLayout';

  render () {
    console.log(this.props)

    return (
      <IconNavLayout brandIcon='rocket' links={[]}>
        {this.props.children}
      </IconNavLayout>
    )
  }
}

export default stateful(MainLayout, 'settings')
