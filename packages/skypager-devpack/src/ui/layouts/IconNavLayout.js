import React, { PropTypes as types } from 'react'
import classnames from 'classnames'

import IconNav from '../components/IconNav'
import defaults from 'lodash/defaultsDeep'
import styles from './IconNavLayout.css.less'

export class IconNavLayout extends React.Component {
  static displayName = 'IconNavLayout';

  static propTypes = {
    branding: types.shape({
      icon: types.string,
      style: types.string,
      brand: types.string
    }).isRequired,
    children: types.node.isRequired,
    containerClassName: types.string,
    navigation: types.shape({
      links: types.arrayOf(types.shape({
        icon: types.string,
        label: types.string,
        links: types.string
      }))
    }).isRequired,
    thin: types.bool,
    wide: types.bool
  };

  render () {
    const classes = classnames({
      'with-iconav': true,
      'iconav-wide': (this.props.wide || !this.props.thin),
      [ styles.wrapper ]: true
    })

    let {
      settings,
      children,
      containerClassName,
      branding,
      navigation
    } = this.props

    console.log('This Props', this.props)

    return (
      <div className={classes}>
        <IconNav brandStyle={branding.style}
                 brandIcon={branding.icon}
                 links={navigation.links} />

        <div className={containerClassName || 'container'}>
          {children}
        </div>
      </div>
    )
  }
}

export default IconNavLayout
