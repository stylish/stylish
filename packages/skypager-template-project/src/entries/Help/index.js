import React, { Component, PropTypes as type } from 'react'
import { Link } from 'react-router'

import stateful from 'ui/util/stateful'

export class Help extends Component {
  static displayName = 'Help';

  static propTypes = {
    copy: type.shape({
      help: type.object
    })
  };

  render() {
    return (
      <div>
        help
     </div>
    )
  }
}

export default stateful(Help, 'copy')
