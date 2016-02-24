import React, { Component, PropTypes as types } from 'react'
import { stateful } from 'ui/applications'
import Icon from 'ui/components/Icon'

export class HomePage extends Component {
  static displayName = 'HomePage';

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
      <div className={style.home}>
        <h1 className={style.brandHeading}>
          <Icon icon={ branding.icon } />
          <span className={style.brandTitle}>{ branding.brand }</span>
        </h1>
      </div>
    )
  }
}

export default stateful(HomePage, 'settings')
