'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listen = listen;
exports.handle = handle;
/**
 * This should create a running instance of a simple JSON logger which can be used to
 * capture and record webhook events from different services such as Dropbox, Github, Google Drive,
 * or Segment.  A router can be used to map different notifications to different project actions.
*/
function listen(program, dispatch) {
  program.command('listen <channel>').description('listen for notifications (e.g. webhooks)').option('--config <path>', 'path to configuration which maps URL / Webhook events to project actions').option('--expose', 'when enabled, will attempt to use ngrok to expose a public API, useful for capturing webhooks').option('--expose-config <path>', 'path to a configuration file for the expose service').action(dispatch(handle));
}

exports.default = listen;
function handle(channel) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  console.log('TODO implement listen cli');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvbGlzdGVuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBS2dCLE1BQU0sR0FBTixNQUFNO1FBWU4sTUFBTSxHQUFOLE1BQU07Ozs7OztBQVpmLFNBQVMsTUFBTSxDQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDekMsU0FBTyxDQUNKLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUMzQixXQUFXLENBQUMsMENBQTBDLENBQUMsQ0FDdkQsTUFBTSxDQUFDLGlCQUFpQixFQUFFLDBFQUEwRSxDQUFDLENBQ3JHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsK0ZBQStGLENBQUMsQ0FDbkgsTUFBTSxDQUFDLHdCQUF3QixFQUFFLHFEQUFxRCxDQUFDLENBQ3ZGLE1BQU0sQ0FBQyxRQUFRLENBQUUsTUFBTSxDQUFFLENBQUMsQ0FBQTtDQUM5Qjs7a0JBRWMsTUFBTTtBQUVkLFNBQVMsTUFBTSxDQUFDLE9BQU8sRUFBOEI7TUFBNUIsT0FBTyx5REFBRyxFQUFFO01BQUUsT0FBTyx5REFBRyxFQUFFOztBQUN4RCxTQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUE7Q0FDekMiLCJmaWxlIjoibGlzdGVuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGlzIHNob3VsZCBjcmVhdGUgYSBydW5uaW5nIGluc3RhbmNlIG9mIGEgc2ltcGxlIEpTT04gbG9nZ2VyIHdoaWNoIGNhbiBiZSB1c2VkIHRvXG4gKiBjYXB0dXJlIGFuZCByZWNvcmQgd2ViaG9vayBldmVudHMgZnJvbSBkaWZmZXJlbnQgc2VydmljZXMgc3VjaCBhcyBEcm9wYm94LCBHaXRodWIsIEdvb2dsZSBEcml2ZSxcbiAqIG9yIFNlZ21lbnQuICBBIHJvdXRlciBjYW4gYmUgdXNlZCB0byBtYXAgZGlmZmVyZW50IG5vdGlmaWNhdGlvbnMgdG8gZGlmZmVyZW50IHByb2plY3QgYWN0aW9ucy5cbiovXG5leHBvcnQgZnVuY3Rpb24gbGlzdGVuIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ2xpc3RlbiA8Y2hhbm5lbD4nKVxuICAgIC5kZXNjcmlwdGlvbignbGlzdGVuIGZvciBub3RpZmljYXRpb25zIChlLmcuIHdlYmhvb2tzKScpXG4gICAgLm9wdGlvbignLS1jb25maWcgPHBhdGg+JywgJ3BhdGggdG8gY29uZmlndXJhdGlvbiB3aGljaCBtYXBzIFVSTCAvIFdlYmhvb2sgZXZlbnRzIHRvIHByb2plY3QgYWN0aW9ucycpXG4gICAgLm9wdGlvbignLS1leHBvc2UnLCAnd2hlbiBlbmFibGVkLCB3aWxsIGF0dGVtcHQgdG8gdXNlIG5ncm9rIHRvIGV4cG9zZSBhIHB1YmxpYyBBUEksIHVzZWZ1bCBmb3IgY2FwdHVyaW5nIHdlYmhvb2tzJylcbiAgICAub3B0aW9uKCctLWV4cG9zZS1jb25maWcgPHBhdGg+JywgJ3BhdGggdG8gYSBjb25maWd1cmF0aW9uIGZpbGUgZm9yIHRoZSBleHBvc2Ugc2VydmljZScpXG4gICAgLmFjdGlvbihkaXNwYXRjaCggaGFuZGxlICkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RlblxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlKGNoYW5uZWwsIG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gIGNvbnNvbGUubG9nKCdUT0RPIGltcGxlbWVudCBsaXN0ZW4gY2xpJylcbn1cbiJdfQ==