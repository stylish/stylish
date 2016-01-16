import React from 'react'
import classnames from 'classnames'

import IconNav from '../components/IconNav'
import styles from './IconNavLayout.css.less'

export class IconNavLayout extends React.Component {
  static displayName = 'IconNavLayout';

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    links: React.PropTypes.array.isRequired,
    brandIcon: React.PropTypes.string,
    brandStyle: React.PropTypes.string
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
