import React, { Component, PropTypes as types } from 'react'
import { stateful } from 'skypager-application'

export class PackagesPage extends Component {
  render () {
    const { entities } = this.props

    return (
      <div>
        <pre>
          {JSON.stringify(entities, null, 2)}
        </pre>
      </div>
    )
  }
}

export default stateful(PackagesPage, 'entities')