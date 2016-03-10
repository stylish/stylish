import React, { Component, PropTypes as types } from 'react'
import { Link } from 'react-router'

import { Icon, SidebarSearchForm } from './index'

export class SidebarNav extends React.Component {
  static displayName = 'SidebarNav';

  static propTypes = {
    children: types.node,
    header: types.element,
    searchForm: types.element
  };

  render () {
    return (
      <nav className='sidebar-nav'>
        {this.props.header}

        <div className='nav-toggleable-sm' id='nav-toggleable-sm'>
          { this.props.searchForm }

          <ul className='nav nav-pills nav-stacked'>
            {this.props.children}
          </ul>
        </div>
      </nav>
    )
  }
}

export default SidebarNav

class SidebarNavHeader extends Component {
  static displayName = 'SidebarNavHeader';

  static propTypes = {
    icon: types.string
  };

  render() {
    return (
      <div className='sidebar-header'>
        <button className='nav-toggler nav-toggler-sm sidebar-toggler' type='button' data-toggle='collapse' data-target='#nav-toggleable-sm'>
          <span className='sr-only'>Toggle nav</span>
        </button>
        <Link className='sidebar-brand img-responsive' to='/'>
          <Icon icon={this.props.icon} className='sidebar-brand-icon' />
        </Link>
      </div>
    )
  }
}

class SidebarNavLink extends React.Component {
  static displayName = 'SidebarNavLink';

  render() {
    const icon = this.props.icon ? (<Icon icon={this.props.icon} />) : null

    return (
      <li>
        <Link to={this.props.to}>
          {this.props.label}
        </Link>
      </li>
    )
  }
}

SidebarNav.Link = SidebarNavLink
SidebarNav.Header = SidebarNavHeader
