import React, { PropTypes as types } from 'react'
import classnames from 'classnames'
import defaults from 'lodash/defaultsDeep'
import get from 'lodash/get'

import IconNav from 'ui/components/IconNav'
import styles from './style.less'

import stateful from 'ui/util/stateful'

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

  static defaultProps = {
    wide: true,
    thin: false,
    containerClassName: 'container'
  };

  render () {
    let { settings, children, containerClassName } = this.props
    let { branding, navigation } = settings

    const classes = classnames({
      'iconav-layout': true,
      'with-iconav': true,
      'iconav-wide': (this.props.wide !== false && !this.props.thin),
      [ styles.wrapper ]: true
    })

    const containerClasses = classnames({
      [containerClassName]: true,
      'iconav-container': true
    })

    const navComponent = !this.props.hideNav
      ? <IconNav brandStyle={branding.style} brandIcon={branding.icon} links={navigation.links} />
      : undefined

    return (
      <div className={classes}>
        {navComponent}
        <div className={containerClasses}>
          {children}
        </div>
      </div>
    )
  }
}

export default stateful(IconNavLayout, 'settings')
