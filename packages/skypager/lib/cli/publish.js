'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.publish = publish;
exports.handle = handle;
/**
 * Publish the project to a service such as Surge, or AWS
*/
function publish(program, dispatch) {
  program.command('publish [domain]').option('--domain <domain>', 'which domain to publish this to?').option('--public', 'which folder should we publish? defaults to the projects public path').option('--build', 'run the build process first').option('--service', 'which service should we publish to? the skypager platform or aws', 'skypager').action(dispatch(handle));
}

exports.default = publish;
function handle() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  console.log('todo implement publish cli using surge');
}

function surgeHandler() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
}

function awsHandler() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvcHVibGlzaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQUdnQixPQUFPLEdBQVAsT0FBTztRQVlQLE1BQU0sR0FBTixNQUFNOzs7O0FBWmYsU0FBUyxPQUFPLENBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUMxQyxTQUFPLENBQ0osT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQzNCLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxrQ0FBa0MsQ0FBQyxDQUMvRCxNQUFNLENBQUMsVUFBVSxFQUFFLHNFQUFzRSxDQUFDLENBQzFGLE1BQU0sQ0FBQyxTQUFTLEVBQUUsNkJBQTZCLENBQUMsQ0FDaEQsTUFBTSxDQUFDLFdBQVcsRUFBRSxrRUFBa0UsRUFBRSxVQUFVLENBQUMsQ0FDbkcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQzVCOztrQkFFYyxPQUFPO0FBRWYsU0FBUyxNQUFNLEdBQTZCO01BQTVCLE9BQU8seURBQUcsRUFBRTtNQUFFLE9BQU8seURBQUcsRUFBRTs7QUFDL0MsU0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFBO0NBQ3REOztBQUVELFNBQVMsWUFBWSxHQUFlO01BQWQsT0FBTyx5REFBRyxFQUFFO0NBRWpDOztBQUVELFNBQVMsVUFBVSxHQUFlO01BQWQsT0FBTyx5REFBRyxFQUFFO0NBRS9CIiwiZmlsZSI6InB1Ymxpc2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFB1Ymxpc2ggdGhlIHByb2plY3QgdG8gYSBzZXJ2aWNlIHN1Y2ggYXMgU3VyZ2UsIG9yIEFXU1xuKi9cbmV4cG9ydCBmdW5jdGlvbiBwdWJsaXNoIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ3B1Ymxpc2ggW2RvbWFpbl0nKVxuICAgIC5vcHRpb24oJy0tZG9tYWluIDxkb21haW4+JywgJ3doaWNoIGRvbWFpbiB0byBwdWJsaXNoIHRoaXMgdG8/JylcbiAgICAub3B0aW9uKCctLXB1YmxpYycsICd3aGljaCBmb2xkZXIgc2hvdWxkIHdlIHB1Ymxpc2g/IGRlZmF1bHRzIHRvIHRoZSBwcm9qZWN0cyBwdWJsaWMgcGF0aCcpXG4gICAgLm9wdGlvbignLS1idWlsZCcsICdydW4gdGhlIGJ1aWxkIHByb2Nlc3MgZmlyc3QnKVxuICAgIC5vcHRpb24oJy0tc2VydmljZScsICd3aGljaCBzZXJ2aWNlIHNob3VsZCB3ZSBwdWJsaXNoIHRvPyB0aGUgc2t5cGFnZXIgcGxhdGZvcm0gb3IgYXdzJywgJ3NreXBhZ2VyJylcbiAgICAuYWN0aW9uKGRpc3BhdGNoKGhhbmRsZSkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IHB1Ymxpc2hcblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZShvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICBjb25zb2xlLmxvZygndG9kbyBpbXBsZW1lbnQgcHVibGlzaCBjbGkgdXNpbmcgc3VyZ2UnKVxufVxuXG5mdW5jdGlvbiBzdXJnZUhhbmRsZXIob3B0aW9ucyA9IHt9KSB7XG5cbn1cblxuZnVuY3Rpb24gYXdzSGFuZGxlcihvcHRpb25zID0ge30pIHtcblxufVxuIl19