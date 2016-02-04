import React from 'react'
import { connect } from 'react-redux'

const mp = function(state) {
  return {
    settings: state.settings
  }
}

export class HomePage extends React.Component {
  render () {
    return (
      <h1>Home is where the heart is</h1>
    )
  }
}

export default connect(mp)(HomePage)
