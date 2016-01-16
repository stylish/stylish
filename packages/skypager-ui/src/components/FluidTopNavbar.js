import React from 'react'
import BodyClassName from 'react-body-classname'
import classnames from 'classnames'

import { Link } from 'react-router'
import Icon from './Icon'

export class FluidTopNavbar extends React.Component {
  render () {
    const classes = classnames({'fluid-layout': true, 'with-top-navbar': true})

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
                <Icon className='navbar-brand-icon' icon='leaf' />
                Dashboard
              </Link>
            </div>
            <div id='navbar' className='navbar-collapse collapse'>
              <ul className='nav navbar-nav'>
                {this.props.children}
              </ul>
              <form className='form-inline navbar-form navbar-right'>
                <div className='input-with-icon'>
                  <input className='form-control' type='text' placeholder='Search...' />
                  <span className='icon icon-magnifying-glass'></span>
                </div>
              </form>
            </div>
          </div>
        </nav>
      </BodyClassName>
    )
  }
}

FluidTopNavbar.propTypes = {
  children: React.PropTypes.array
}

export default FluidTopNavbar
