import React, { Component, PropTypes as types } from 'react'
import IconNavLayout from 'skypager-ui/lib/layouts/IconNavLayout'

import project from 'dist/bundle'

export class MainLayout extends Component {
  static displayName = 'MainLayout';

  render () {
    const settings = project.settings
    const {branding, navigation} = settings

    console.log(settings)

    return (
      <IconNavLayout wide brandIcon={branding.icon} links={navigation.links}>
        {this.props.children}
      </IconNavLayout>
    )
  }
}

export default MainLayout
