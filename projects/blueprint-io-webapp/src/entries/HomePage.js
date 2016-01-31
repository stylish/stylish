import React from 'react'
import { stateful as connect } from 'skypager-application'
import { Button } from 'react-bootstrap'

export class HomePage extends React.Component {
  render () {
    return (
      <h1>Hello How are you?.</h1>
    )
  }
}

export default connect(HomePage, 'auth')
