import React from 'react'
import { Link } from 'react-router'

import { Icon, SidebarSearchForm } from './index'

export class SidebarNav extends React.Component {
  render () {
    return (
      <nav className='sidebar-nav'>
        <div className='sidebar-header'>
          <button className='nav-toggler nav-toggler-sm sidebar-toggler' type='button' data-toggle='collapse' data-target='#nav-toggleable-sm'>
            <span className='sr-only'>Toggle nav</span>
          </button>
          <Link className='sidebar-brand img-responsive' to='/'>
            <Icon icon='leaf' className='sidebar-brand-icon' />
          </Link>
        </div>

        <div className='collapse nav-toggleable-sm' id='nav-toggleable-sm'>
          <SidebarSearchForm />

          <ul className='nav nav-pills nav-stacked'>
            {this.props.children}
          </ul>
        </div>
      </nav>
    )
  }
}

SidebarNav.propTypes = {
  children: React.PropTypes.array
}

export default SidebarNav
