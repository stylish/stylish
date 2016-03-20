import React, { Component, PropTypes as type } from 'react'
import stateful from 'ui/util/stateful'

/**
 * A Browse Page is a good index route for an entry point (e.g. /products)
 *
 */
export class BlankBrowse extends Component {
  static displayName = 'BlankBrowse';

  static propTypes = {

  };

  static defaultProps = {

  };

  render() {
    return <div />
  }
}

export default stateful(BlankBrowse, 'settings', 'copy', 'entities')
