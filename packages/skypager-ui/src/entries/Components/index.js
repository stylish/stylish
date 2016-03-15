import React, { Component, PropTypes as type } from 'react'
import stateful from 'ui/util/stateful'

import DashboardHeader from 'ui/components/DashboardHeader'

const categoryFolder = 'components'

export class Components extends Component {
  static displayName = 'Components';

  static route = {
    screens: {
      index: 'Components/Browse',
      'details/*': 'Components/Details'
    }
  };

  static propTypes = {
    /** copy pulled from the projects i18n system */
    copy: type.shape({
      components: type.shape({
        browseHeading: type.string,
        browseSubtitle: type.string
      })
    })
  };

  render() {
    const copy = this.props.copy

    return (
      <div className="p-t-md">
        <DashboardHeader title={copy.components.browseHeading} subtitle={copy.components.browseSubtitle} />
        <hr className="m-t-md" />
        {this.props.children}
      </div>
    )
  }
}

export default stateful(Components, 'settings', 'components.filters', 'copy')
