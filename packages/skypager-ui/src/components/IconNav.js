import React, { PropTypes as types } from 'react'
import { Link } from 'react-router'

import classnames from 'classnames'

import Icon from './Icon'

export class IconNav extends React.Component {
  render () {
    const props = this.props
    const brandIcon = props.brandIcon
    const styles = require('./IconNav.css.less')
    const links = props.links.map((link,index) => {
    const active = !!(AppStore.getState().router.path === link.link)
      console.log('Settings', this.props.settings)
      return (
        <li key={index} className={active ? 'active' : undefined}>
          <Link to={link.link} title={link.label}>
            <Icon icon={link.icon} />
            <span className='nav-label'>{link.label}</span>
          </Link>
        </li>
      )
    })

    let classes = classnames({
      iconav: true,
      wtf: true,
      [styles.iconav]: true
    })

    return (
      <nav className={classes}>
        <Link to='/' className='iconav-brand' >
          <Icon className={'iconav-brand-icon ' + this.props.brandStyle} icon={brandIcon} />
        </Link>

        <div className='iconav-slider'>
          <ul className='nav nav-pills iconav-nav'>
            {links}
          </ul>
        </div>
      </nav>
    )

  }
}

IconNav.propTypes = {
  brandIcon: types.string.isRequired,
  brandStyle: types.string,
  links: types.arrayOf(types.shape({
    link: types.string.isRequired,
    icon: types.string,
    label: types.string
  }))
}

export default IconNav
