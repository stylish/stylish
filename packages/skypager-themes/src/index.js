import React from 'react'
import { render } from 'react-dom'

class App extends React.Component {
  render () {
    return (
      <div className='container'>
        <h1>Hello World</h1>
        <a className='btn btn-primary btn-primary-outline btn-large'>What up?</a>
      </div>
    )
  }
}

render(<App />, document.getElementById('app'))
