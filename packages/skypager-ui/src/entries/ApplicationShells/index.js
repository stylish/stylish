import React, { Component, PropTypes as type } from 'react'
import stateful from 'ui/util/stateful'

import DashboardHeader from 'ui/components/DashboardHeader'

const categoryFolder = 'shells'

export class ApplicationShells extends Component {
  static displayName = 'ApplicationShells';

  static route = {
    screens: {
      index: 'ApplicationShells/Browse',
      'details/*': 'ApplicationShells/Details'
    }
  };

  static propTypes = {
    /** copy pulled from the projects i18n system */
    copy: type.shape({
      shells: type.shape({
        browseHeading: type.string,
        browseSubtitle: type.string
      })
    })
  };

  render() {
    const copy = this.props.copy

    return (
      <div className="p-t-md">
        <DashboardHeader title={copy.shells.browseHeading} subtitle={copy.shells.browseSubtitle} />
        <hr className="m-t-md" />
        {this.props.children}
      </div>
    )
  }
}

export default stateful(ApplicationShells, 'settings', 'shells.filters', 'copy')
