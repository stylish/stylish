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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9saXN0ZW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFLZ0IsTUFBTSxHQUFOLE1BQU07UUFZTixNQUFNLEdBQU4sTUFBTTs7Ozs7O0FBWmYsU0FBUyxNQUFNLENBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN6QyxTQUFPLENBQ0osT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQzNCLFdBQVcsQ0FBQywwQ0FBMEMsQ0FBQyxDQUN2RCxNQUFNLENBQUMsaUJBQWlCLEVBQUUsMEVBQTBFLENBQUMsQ0FDckcsTUFBTSxDQUFDLFVBQVUsRUFBRSwrRkFBK0YsQ0FBQyxDQUNuSCxNQUFNLENBQUMsd0JBQXdCLEVBQUUscURBQXFELENBQUMsQ0FDdkYsTUFBTSxDQUFDLFFBQVEsQ0FBRSxNQUFNLENBQUUsQ0FBQyxDQUFBO0NBQzlCOztrQkFFYyxNQUFNO0FBRWQsU0FBUyxNQUFNLENBQUMsT0FBTyxFQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQ3hELFNBQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQTtDQUN6QyIsImZpbGUiOiJsaXN0ZW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoaXMgc2hvdWxkIGNyZWF0ZSBhIHJ1bm5pbmcgaW5zdGFuY2Ugb2YgYSBzaW1wbGUgSlNPTiBsb2dnZXIgd2hpY2ggY2FuIGJlIHVzZWQgdG9cbiAqIGNhcHR1cmUgYW5kIHJlY29yZCB3ZWJob29rIGV2ZW50cyBmcm9tIGRpZmZlcmVudCBzZXJ2aWNlcyBzdWNoIGFzIERyb3Bib3gsIEdpdGh1YiwgR29vZ2xlIERyaXZlLFxuICogb3IgU2VnbWVudC4gIEEgcm91dGVyIGNhbiBiZSB1c2VkIHRvIG1hcCBkaWZmZXJlbnQgbm90aWZpY2F0aW9ucyB0byBkaWZmZXJlbnQgcHJvamVjdCBhY3Rpb25zLlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBsaXN0ZW4gKHByb2dyYW0sIGRpc3BhdGNoKSB7XG4gIHByb2dyYW1cbiAgICAuY29tbWFuZCgnbGlzdGVuIDxjaGFubmVsPicpXG4gICAgLmRlc2NyaXB0aW9uKCdsaXN0ZW4gZm9yIG5vdGlmaWNhdGlvbnMgKGUuZy4gd2ViaG9va3MpJylcbiAgICAub3B0aW9uKCctLWNvbmZpZyA8cGF0aD4nLCAncGF0aCB0byBjb25maWd1cmF0aW9uIHdoaWNoIG1hcHMgVVJMIC8gV2ViaG9vayBldmVudHMgdG8gcHJvamVjdCBhY3Rpb25zJylcbiAgICAub3B0aW9uKCctLWV4cG9zZScsICd3aGVuIGVuYWJsZWQsIHdpbGwgYXR0ZW1wdCB0byB1c2Ugbmdyb2sgdG8gZXhwb3NlIGEgcHVibGljIEFQSSwgdXNlZnVsIGZvciBjYXB0dXJpbmcgd2ViaG9va3MnKVxuICAgIC5vcHRpb24oJy0tZXhwb3NlLWNvbmZpZyA8cGF0aD4nLCAncGF0aCB0byBhIGNvbmZpZ3VyYXRpb24gZmlsZSBmb3IgdGhlIGV4cG9zZSBzZXJ2aWNlJylcbiAgICAuYWN0aW9uKGRpc3BhdGNoKCBoYW5kbGUgKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdGVuXG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGUoY2hhbm5lbCwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgY29uc29sZS5sb2coJ1RPRE8gaW1wbGVtZW50IGxpc3RlbiBjbGknKVxufVxuIl19