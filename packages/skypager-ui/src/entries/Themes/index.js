import React, { Component, PropTypes as type } from 'react'
import stateful from 'ui/util/stateful'

import DashboardHeader from 'ui/components/DashboardHeader'

export class Themes extends Component {
  static displayName = 'Themes';

  static route = {
    screens: {
      index: 'Themes/Browse',
      'details/*': 'Themes/Details'
    }
  };

  static propTypes = {
    /** copy pulled from the projects i18n system */
    copy: type.shape({
      themes: type.shape({
        browseHeading: type.string,
        browseSubtitle: type.string
      })
    })
  };

  render() {
    const copy = this.props.copy

    return (
      <div className="p-t-md">
        <DashboardHeader title={copy.themes.browseHeading} subtitle={copy.themes.browseSubtitle} />
        <hr className="m-t-md" />
        {this.props.children}
      </div>
    )
  }
}

export default stateful(Themes, 'settings', 'themes.filters', 'copy')
