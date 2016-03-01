import React, { Component, PropTypes as types } from 'react'
import { stateful } from 'ui/applications'
import Icon from 'ui/components/Icon'

import styles from './styles.less';

export class Home extends Component {
  static displayName = 'Home';

  static propTypes = {
    settings: types.shape({
      branding: types.shape({
        icon: types.string,
        brand: types.string
      })
    })
  };

  render () {
    const { settings } = this.props
    const { branding } = settings

    return (
      <div className={styles.home}>
        <h1 className={styles.brandHeading}>
          <Icon icon={ branding.icon } />
          <span className={styles.brandTitle}>{ branding.brand }</span>
        </h1>
      </div>
    )
  }
}

export default stateful(Home, 'settings')
