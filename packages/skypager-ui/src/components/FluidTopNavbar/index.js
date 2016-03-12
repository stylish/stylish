import React, { Component, PropTypes as types } from 'react'
import BodyClassName from 'react-body-classname'
import classnames from 'classnames'

import { Link } from 'react-router'
import Icon from 'ui/components/Icon'

export class FluidTopNavbar extends Component {
  static displayName = 'FluidTopNavbar';

  static propTypes = {
    searchForm: types.node,

    links: types.arrayOf(types.shape({
      label: types.string,
      link: types.string
    })),

    branding: types.shape({
      icon: types.string,
      brand: types.string
    })
  }

  render () {
    const classes = classnames({'fluid-layout': true, 'with-top-navbar': true})

    const { searchForm, branding, links } = this.props

    const navLinks = links.map((item, key) => {
      const active = item.link
      return (
        <li key={key} className={active}>
          <Link to={item.link}>{item.label}</Link>
        </li>
      )
    })

    return (
      <BodyClassName className={classes}>
        <nav className='navbar navbar-inverse navbar-fixed-top'>
          <div className='container-fluid container-fluid-spacious'>
            <div className='navbar-header'>
              <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar' aria-expanded='false' aria-controls='navbar'>
                <span className='sr-only'>Toggle navigation</span>
                <span className='icon-bar'></span>
                <span className='icon-bar'></span>
                <span className='icon-bar'></span>
              </button>
              <Link className='navbar-brand navbar-brand-emphasized' to='/'>
                <Icon className='navbar-brand-icon' icon={branding.icon} />
                { branding.brand }
              </Link>
            </div>
            <div id='navbar' className='navbar-collapse collapse'>
              <ul className='nav navbar-nav'>
                { navLinks }
              </ul>
              { searchForm }
            </div>
          </div>
        </nav>
      </BodyClassName>
    )
  }
}

export default FluidTopNavbar
