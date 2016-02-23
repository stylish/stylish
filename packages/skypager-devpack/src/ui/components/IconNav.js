import React, { PropTypes as types } from 'react'
import { Link } from 'react-router'

import classnames from 'classnames'

import Icon from './Icon'

import styles from './IconNav.less'

export class IconNav extends React.Component {
  static displayName = 'IconNav';

  static propTypes = {
    brandIcon: types.string,
    brandStyle: types.string,
    links: types.arrayOf(types.shape({
      link: types.string.isRequired,
      icon: types.string,
      label: types.string
    })).isRequired
  };

  render () {
    const { brandStyle, brandIcon } = this.props

    const links = (this.props.links || []).map((link,index) => {
      let active = false

      return (
        <li key={index} className={active ? 'active' : undefined}>
          <Link to={link.link} title={link.label}>
            <Icon icon={link.icon} />
            <span className='nav-label'>{link.label}</span>
          </Link>
        </li>
      )
    })

    let classes = classnames({ iconav: true, [styles.iconav]: true })

    return (
      <nav className={classes}>
        <Link to='/' className='iconav-brand' >
          <Icon className={'iconav-brand-icon ' + brandStyle}
                icon={brandIcon} />
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

function flatten (array) {
   return array.reduce((memo,item) => memo.concat(item) )
}

export default IconNav
