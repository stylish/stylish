import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'

import history from 'history/lib/createBrowserHistory'

import Main from './entries/Main'

export class Application {
  static render (options = {}) {
    if ( typeof options === 'string' ) {
      options = {el: options}
    }

    console.log('hi')
    let App = global.App = new Application(options)

    App.render()

    return App
  }

  constructor (options) {
    this.options = options
  }

  render () {
    render(
      <Router history = {history()} >
        { this.routes }
      </Router>,
      document.getElementById(this.options.el)
    )
  }

  get routes () {
    return (
       <Route path='/'>
          <IndexRoute component={Main} />
       </Route>
    )
  }
}

export default Application
