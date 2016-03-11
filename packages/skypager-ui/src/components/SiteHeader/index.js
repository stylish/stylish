import React, { Component, PropTypes as type } from 'react'
import { stateful } from 'ui/applications'

import Icon from 'ui/components/Icon'

export class SiteHeader extends Component {
  static displayName = 'SiteHeader';

  static propTypes = {
    branding: type.shape({
      brand: type.string.isRequired,
      icon: type.string
    }),
    copy: type.object.isRequired
  };

  render() {
    const { copy, branding } = this.props
    const { brand, icon } = branding

    return (
      <div className='site-header'>
        <h1>
          <Icon icon={icon} />
          &nbsp;
          {brand}
        </h1>
      </div>
    )
  }
}

export default stateful(SiteHeader, 'settings.branding', 'copy')
