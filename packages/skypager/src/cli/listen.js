/**
 * This should create a running instance of a simple JSON logger which can be used to
 * capture and record webhook events from different services such as Dropbox, Github, Google Drive,
 * or Segment.  A router can be used to map different notifications to different project actions.
*/
export function listen (program, dispatch) {
  program
    .command('listen <channel>')
    .description('listen for notifications (e.g. webhooks)')
    .option('--config <path>', 'path to configuration which maps URL / Webhook events to project actions')
    .option('--expose', 'when enabled, will attempt to use ngrok to expose a public API, useful for capturing webhooks')
    .option('--expose-config <path>', 'path to a configuration file for the expose service')
    .action(dispatch( handle ))
}

export default listen

export function handle(channel, options = {}, context = {}) {
  console.log('TODO implement listen cli')
}
