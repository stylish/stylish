import React from 'react'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'

function mapStateToProps (state) {
  return {
    settings: state.settings
  }
}

export class HomePage extends React.Component {
  static displayName = 'HomePage';

  render () {
    return (
      <div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(HomePage)
