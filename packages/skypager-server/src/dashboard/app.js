import React, { createElement as el, Component, PropTypes as types } from 'react'
import { omit, defaultsDeep as defaults, values } from 'lodash'
import { defineProp, shell, colorize } from '../util.js'
import { createReadStream as readable } from 'fs'
import { join } from 'path'

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

    defineProp(this, 'project', project)
    defineProp(this, 'screen', screen)
    defineProp(this, 'log', screen.log.bind(screen))

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
    let app = this
    let { panels } = this.state
    let { logPath, env, processes } = this.props

    panels
      .filter(panel => panel.process && panel.type === 'log')
      .forEach(panel => {
        let logPanel = app.refs[panel.ref]
        let stream = processes[panel.process]

        stream().progress(child => {
          child.stdout.on('data', (buffer) => {
            logPanel.add(buffer.toString())
          })
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
