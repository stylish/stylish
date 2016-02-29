import { join } from 'path'

import skypager from '../../skypager-project'
import plugin from '../src/index.js'

skypager.loadPlugin(plugin)

const project = require('./fixture')

module.exports = { skypager, project }
