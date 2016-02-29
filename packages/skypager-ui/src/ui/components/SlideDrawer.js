import React from 'react'
import cx from 'classnames'

import Icon from './Icon'

import styles from './SlideDrawer.css.less'

export class SlideDrawer extends React.Component {
  render () {
    const classes = cx({
      ['position-' + this.props.position || 'right'] : true,
      [styles.drawer]: true,
			[styles.light]: true,
      'slide-drawer': true,
			'active': this.props.active
    })

    return (
      <div className={classes}>
        <div className={styles.inner}>
          <div onClick={this.props.handleCloseClick}>
            <Icon className='close-icon' icon='cross' />
          </div>

          {this.props.children}
        </div>
      </div>
    )
  }
}

SlideDrawer.propTypes = {
  position: React.PropTypes.string
}

export default SlideDrawer
