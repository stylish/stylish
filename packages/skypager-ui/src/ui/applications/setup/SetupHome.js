import React, { Component, PropTypes as types } from 'react'
import { util } from 'ui/applications'

import { Panel } from 'react-bootstrap'

const { stateful } = util

export class SetupHome extends Component {
  static displayName = 'SetupHome';

  render () {
    return (
      <div>
        <Panel>
          Skypager Setup Wizard
        </Panel>
      </div>
    )
  }
}

export default stateful(SetupHome, 'project', 'settings')
