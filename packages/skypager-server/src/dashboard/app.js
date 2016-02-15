import React, { createElement as el, Component, PropTypes as types } from 'react'
import { omit, defaultsDeep as defaults, values } from 'lodash'
import { define, shell, colorize } from '../util.js'
import { readFileSync as readFile } from 'fs'

export class App extends Component {
  static childContextTypes = {
    project: types.object,
    screen: types.object,
    settings: types.object,
    log: types.func
  };

  constructor(args = {}) {
    let { options, project, screen } = args
    let props = omit(args, 'screen', 'project')

    super(props)

    define(this, 'project', project)
    define(this, 'screen', screen)
    define(this, 'log', screen.log.bind(screen))

    let panels = Object.keys(options.panels).map((ref,key) => {
      let panel = options.panels[ref]

      return {
        type: panel.type || 'log',
        ref,
        ...panel,
        ...(borderStyles(panel.borderStyles)),
        key
      }
    })

    this.state = {
      panels
    }
  }

  getChildContext () {
    return {
      project: this.project,
      screen: this.screen,
      settings: this.project.settings,
      log: this.log,
    }
  }


  componentDidMount () {
    let { panels } = this.state
    let { streamer } = this.props
    let app = this

    panels
      .filter(panel => panel.process && panel.type === 'log')
      .forEach(panel => {
        let logPath = this.project.path('logs', `streamer-${ panel.process }.log`)
        shell(`tail -f ${ logPath }`, {}, (buffer) => {
          app.refs[panel.ref].add(buffer.toString())
        })
      })
  }

  render () {
    let { panels } = this.state
    let { project } = this

    let boxes = panels.map((panel,key) => {
      return el(
        panel.type,
        panel
      )
    })

    return(
      <box>
        {boxes}
      </box>
    )
  }
}

export default App


function borderStyles(options = {style: 'line', color: 'white'}) {
  let {style, color} = options

  return {
    border : {
      type: style
    },
    style : {
      border: {
        fg: color
      }
    }
  }
}
