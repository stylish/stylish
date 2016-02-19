import React, { PropTypes as types } from 'react'
import classnames from 'classnames'

import IconNav from '../components/IconNav'
import defaults from 'lodash/defaultsDeep'
import styles from './IconNavLayout.css.less'

export class IconNavLayout extends React.Component {
  static displayName = 'IconNavLayout';

  static propTypes = {
    children: types.node.isRequired,
    containerClassName: types.string,
    settings: types.shape({
      navigation: types.shape({
        links: types.array
      }),
      branding: types.shape({
        icon: types.string,
        brand: types.string,
        style: types.string
      })
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

    let { settings, children, containerClassName } = this.props
    let { branding, navigation } = settings

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
