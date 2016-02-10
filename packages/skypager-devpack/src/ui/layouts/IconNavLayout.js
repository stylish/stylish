import React, { PropTypes as types } from 'react'
import classnames from 'classnames'

import IconNav from '../components/IconNav'
import styles from './IconNavLayout.css.less'

export class IconNavLayout extends React.Component {
  static displayName = 'IconNavLayout';

  static propTypes = {
    children: types.node.isRequired,
    wide: types.bool,
    containerClassName: types.string,
    links: types.array.isRequired,
    brandIcon: types.string,
    brandStyle: types.string
  };

  render () {
    const classes = classnames({
      'with-iconav': true,
      'iconav-wide': this.props.wide,
      [ styles.wrapper ]: true
    })

    let {
      brandStyle,
      brandIcon,
      children,
      containerClassName,
      links
    } = this.props

    return (
      <div className={classes}>
        <IconNav brandStyle={brandStyle}
                 brandIcon={brandIcon}
                 links={links} />

        <div className={containerClassName || 'container'}>
          {children}
        </div>
      </div>
    )
  }
}

export default IconNavLayout
