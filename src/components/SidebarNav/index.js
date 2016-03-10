import React, { Component, PropTypes as type } from 'react'
import { stateful } from 'ui/applications'

import SidebarNavigation from 'ui/components/SidebarNav'

export class SidebarNav extends Component {
  static displayName = 'SidebarNav';

  static propTypes = {
    outlines: type.shape({
      index: type.shape({
        html: type.string.isRequired
      })
    })
  };

  render() {
    return (
      <SidebarNavigation>
        <SidebarNavigation.Link to="/" label='Home' />
        <SidebarNavigation.Link to="documentation" label='Documentation' />
        <SidebarNavigation.Link to="documentation" label='Documentation' />
        <SidebarNavigation.Link to="documentation" label='Documentation' />
        <SidebarNavigation.Link to="documentation" label='Documentation' />
        <SidebarNavigation.Link to="documentation" label='Documentation' />
        <SidebarNavigation.Link to="documentation" label='Documentation' />
        <SidebarNavigation.Link to="documentation" label='Documentation' />
      </SidebarNavigation>
    )
  }
}

export default stateful(SidebarNav, 'settings', 'entities.outlines')
