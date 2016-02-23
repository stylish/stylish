import React from 'react'
import { render } from 'react-dom'

class Editor extends React.Component {
  render() {
    return (
      <h1>Editor</h1>
    )
  }
}

render(<Editor />, document.getElementById('app'))
