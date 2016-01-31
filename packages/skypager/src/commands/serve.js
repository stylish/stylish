import { join, dirname } from 'path'

import shell from 'shelljs'
import util from '../util'

export function serve (program, dispatch) {
  program
    .command('serve')
    .option('--port <port>', 'which port? specify any to use any available port', 3000)
    .option('--host <hostname>', 'which hostname? defaults to localhost', 'localhost')
    .option('--expose', 'when enabled, will expose this server to the public using ngrok')
    .option('--expose-config <path>', 'path to a config file for the expose service')
    .action(dispatch(handle))
}

export default serve

export function handle(options = {}, context = {}) {
  console.log('TODO handle serve CLI')
}

