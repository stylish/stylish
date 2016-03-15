import React, { Component, PropTypes as type } from 'react'
import stateful from 'ui/util/stateful'

import DashboardHeader from 'ui/components/DashboardHeader'

export class Layouts extends Component {
  static displayName = 'Layouts';

  static route = {
    screens: {
      index: 'Layouts/Browse',
      'details/*': 'Layouts/Details'
    }
  };

  static propTypes = {
    /** copy pulled from the projects i18n system */
    copy: type.shape({
      layouts: type.shape({
        browseHeading: type.string,
        browseSubtitle: type.string
      })
    })
  };

  render() {
    const copy = this.props.copy

    return (
      <div className="p-t-md">
        <DashboardHeader title={copy.layouts.browseHeading} subtitle={copy.layouts.browseSubtitle} />
        <hr className="m-t-md" />
        {this.props.children}
      </div>
    )
  }
}

export default stateful(Layouts, 'settings', 'layouts.filters', 'copy')
