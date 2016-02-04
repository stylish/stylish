import React, { Component, PropTypes as types } from 'react'
import { stateful } from 'skypager-application'
import IconNavLayout from 'skypager-ui/src/layouts/IconNavLayout'

export class MainLayout extends Component {
  static displayName = 'MainLayout';

  static contextTypes = {
    store: types.object,
    project: types.object
  };

  render () {
    let settings = this.context.project.settings
    let brandIcon = settings.branding.icon
    let links = settings.navigation.links

    return (
      <IconNavLayout wide brandIcon={brandIcon} links={links}>
        <pre>{ JSON.stringify(settings.branding, null, 2) }</pre>
        { this.props.children }
      </IconNavLayout>
    )
  }
}

export default stateful(MainLayout, 'settings')