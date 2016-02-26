import blessed from 'blessed';
import { join } from 'path'
import { colorize } from '../util.js'
import { createReadStream as readable, openSync, exists } from 'fs'
import winston from 'winston'

module.exports = dashboard

const { keys, assign } = Object

import pick from 'lodash/pick'
import defaults from 'lodash/defaultsDeep'
import mapValues from 'lodash/mapValues'
import values from 'lodash/values'

function dashboard(server, options) {
  const project = server.project

  const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    title: 'Skypager',
    dockBorders: true
  });

  // Let user quit the app
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  server.panels = renderPanels(screen, options)

  console.log('Options Panels', options.panels)

  mapValues(options.panels, (panel, key) => {
    if (panel.type === 'log' && panel.process) {
      let panelOutput = server.logPath(`${panel.process}.${server.env}.log`)
      let logPanel = server.panels[key]

      logPanel.add('Monitoring log at ' + panelOutput)

      streamer(panelOutput, logPanel.add.bind(logPanel))
    }

  })

  const logger = new (winston.Logger)({
    level: 'debug',
    transports:[
      new (winston.transports.File)({
        filename: server.logPath(`dashboard.${server.env}.log`),
        json: true,
        colorize: true
      })
    ]
  })

  function silence() {
    // Don't overwrite the screen
    console.log = capture('log')
    console.warn = capture('warn')
    console.error = capture('error')
    console.info = capture('info')
    console.debug = capture('debug')
  }

  function capture(level) {
    return (...args) => {
      logger.log(level, ...args)
    }
  }
}

function renderPanels(screen, options) {
  let configs = mapValues(options.panels, (panel, name) => {
    return assign(panel, {name})
  })

  let panels = mapValues(configs, (panel, name) => {
    let type = panel.type || 'box'
    let widget = blessed[type] || blessed.box
    let config = pick(panel, 'top', 'left', 'height', 'width', 'label', 'border', 'style')

    if (panel.borderStyles) {
      config = defaults(config, borderStyles(panel.borderStyles))
    }

    let element = widget(config)

    screen.append(element)

    return element
  })

  screen.render()

  return panels
}

function borderStyles(options = {}) {
  defaults(options, {
    type: 'line',
    color: 'white'
  })

  let { type, color } = options

  return {
    border: {
      type
    },
    style: {
      border:{
        fg: color
      }
    }
  }
}

function streamer(path, onData) {
  let spawn = require('child_process').spawn

  let proc = spawn('tail', ['-f', path])

  proc.stdout.on('data', (buffer) => {
     onData(
       buffer.toString()
     )
  })
}
