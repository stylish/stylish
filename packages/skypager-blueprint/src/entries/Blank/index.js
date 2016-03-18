import React, { Component, PropTypes as type } from 'react'
import stateful from 'ui/util/stateful'

export class Blank extends Component {
  static displayName = 'Blank';

  static route = {
    screens: {
      index: 'Blank/Browse',
      'details/*': 'Blank/Details'
    }
  };

  static propTypes = {
    /** copy pulled from the projects i18n system */
    copy: type.object,
    /** project settings data */
    settings: type.object
  };

  render() {
    const { settings, copy } = this.props

    return (
      <div className="p-t-md">
        {this.props.children}
      </div>
    )
  }
}

export default stateful(Blank, 'settings', 'copy')
