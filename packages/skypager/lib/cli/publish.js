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
  program.command('publish [domain]').option('--domain <domain>', 'which domain to publish this to?').option('--public', 'which folder should we publish? defaults to the projects public path').option('--build', 'run the build process first').option('--build-command', 'which build command').option('--service <domain>', 'which service should we publish to? aws, surge.sh, some other domain', 'surge.sh').action(dispatch(handle));
}

exports.default = publish;
function handle(domain) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var project = context.project;

  domain = domain || options.domain || project.options.domain;
  options.public = options.public || project.paths.public;

  if (options.service === 'blueprint.io' || options.service === 'skypager.io') {
    options.endpoint = 'surge.' + options.service;
    surgePlatformHandler(domain, options, context);
  } else if (options.service.match(/surge/i)) {
    surgeHandler(domain, options, context);
  }
}

function surgePlatformHandler(domain) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  console.log('TODO: Implement this internally');
  console.log('Run this:');
  console.log();
  console.log(('surge deploy --project ' + options.public + ' --domain ' + domain + ' --endpoint ' + options.endpoint).yellow);
}

function surgeHandler(domain) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  console.log('TODO: Implement this internally');
  console.log('Run this:');
  console.log();
  console.log('surge deploy --project ' + options.public + ' --domain ' + options.domain);
}

function awsHandler(domain) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  console.log('TODO: Implement this internally');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvcHVibGlzaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQUdnQixPQUFPLEdBQVAsT0FBTztRQWFQLE1BQU0sR0FBTixNQUFNOzs7O0FBYmYsU0FBUyxPQUFPLENBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUMxQyxTQUFPLENBQ0osT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQzNCLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxrQ0FBa0MsQ0FBQyxDQUMvRCxNQUFNLENBQUMsVUFBVSxFQUFFLHNFQUFzRSxDQUFDLENBQzFGLE1BQU0sQ0FBQyxTQUFTLEVBQUUsNkJBQTZCLENBQUMsQ0FDaEQsTUFBTSxDQUFDLGlCQUFpQixFQUFFLHFCQUFxQixDQUFDLENBQ2hELE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxzRUFBc0UsRUFBRSxVQUFVLENBQUMsQ0FDaEgsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQzVCOztrQkFFYyxPQUFPO0FBRWYsU0FBUyxNQUFNLENBQUMsTUFBTSxFQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7TUFDakQsT0FBTyxHQUFLLE9BQU8sQ0FBbkIsT0FBTzs7QUFFYixRQUFNLEdBQUcsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUE7QUFDM0QsU0FBTyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFBOztBQUV2RCxNQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssY0FBYyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssYUFBYSxFQUFFO0FBQzNFLFdBQU8sQ0FBQyxRQUFRLGNBQWEsT0FBTyxDQUFDLE9BQU8sQUFBRyxDQUFBO0FBQy9DLHdCQUFvQixDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7R0FDL0MsTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzFDLGdCQUFZLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtHQUN2QztDQUNGOztBQUVELFNBQVMsb0JBQW9CLENBQUMsTUFBTSxFQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQzlELFNBQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQTtBQUM5QyxTQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ3hCLFNBQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUNiLFNBQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTJCLE9BQU8sQ0FBQyxNQUFNLGtCQUFlLE1BQU0sb0JBQWlCLE9BQU8sQ0FBQyxRQUFRLEVBQUksTUFBTSxDQUFDLENBQUE7Q0FDdkg7O0FBRUQsU0FBUyxZQUFZLENBQUMsTUFBTSxFQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQ3RELFNBQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQTtBQUM5QyxTQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ3hCLFNBQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUNiLFNBQU8sQ0FBQyxHQUFHLDZCQUE0QixPQUFPLENBQUMsTUFBTSxrQkFBZSxPQUFPLENBQUMsTUFBTSxDQUFJLENBQUE7Q0FDdkY7O0FBRUQsU0FBUyxVQUFVLENBQUMsTUFBTSxFQUFnQjtNQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDdEMsU0FBTyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFBO0NBQy9DIiwiZmlsZSI6InB1Ymxpc2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFB1Ymxpc2ggdGhlIHByb2plY3QgdG8gYSBzZXJ2aWNlIHN1Y2ggYXMgU3VyZ2UsIG9yIEFXU1xuKi9cbmV4cG9ydCBmdW5jdGlvbiBwdWJsaXNoIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ3B1Ymxpc2ggW2RvbWFpbl0nKVxuICAgIC5vcHRpb24oJy0tZG9tYWluIDxkb21haW4+JywgJ3doaWNoIGRvbWFpbiB0byBwdWJsaXNoIHRoaXMgdG8/JylcbiAgICAub3B0aW9uKCctLXB1YmxpYycsICd3aGljaCBmb2xkZXIgc2hvdWxkIHdlIHB1Ymxpc2g/IGRlZmF1bHRzIHRvIHRoZSBwcm9qZWN0cyBwdWJsaWMgcGF0aCcpXG4gICAgLm9wdGlvbignLS1idWlsZCcsICdydW4gdGhlIGJ1aWxkIHByb2Nlc3MgZmlyc3QnKVxuICAgIC5vcHRpb24oJy0tYnVpbGQtY29tbWFuZCcsICd3aGljaCBidWlsZCBjb21tYW5kJylcbiAgICAub3B0aW9uKCctLXNlcnZpY2UgPGRvbWFpbj4nLCAnd2hpY2ggc2VydmljZSBzaG91bGQgd2UgcHVibGlzaCB0bz8gYXdzLCBzdXJnZS5zaCwgc29tZSBvdGhlciBkb21haW4nLCAnc3VyZ2Uuc2gnKVxuICAgIC5hY3Rpb24oZGlzcGF0Y2goaGFuZGxlKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgcHVibGlzaFxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlKGRvbWFpbiwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgbGV0IHsgcHJvamVjdCB9ID0gY29udGV4dFxuXG4gIGRvbWFpbiA9IGRvbWFpbiB8fCBvcHRpb25zLmRvbWFpbiB8fCBwcm9qZWN0Lm9wdGlvbnMuZG9tYWluXG4gIG9wdGlvbnMucHVibGljID0gb3B0aW9ucy5wdWJsaWMgfHwgcHJvamVjdC5wYXRocy5wdWJsaWNcblxuICBpZiAob3B0aW9ucy5zZXJ2aWNlID09PSAnYmx1ZXByaW50LmlvJyB8fCBvcHRpb25zLnNlcnZpY2UgPT09ICdza3lwYWdlci5pbycpIHtcbiAgICBvcHRpb25zLmVuZHBvaW50ID0gYHN1cmdlLiR7IG9wdGlvbnMuc2VydmljZSB9YFxuICAgIHN1cmdlUGxhdGZvcm1IYW5kbGVyKGRvbWFpbiwgb3B0aW9ucywgY29udGV4dClcbiAgfSBlbHNlIGlmIChvcHRpb25zLnNlcnZpY2UubWF0Y2goL3N1cmdlL2kpKSB7XG4gICAgc3VyZ2VIYW5kbGVyKGRvbWFpbiwgb3B0aW9ucywgY29udGV4dClcbiAgfVxufVxuXG5mdW5jdGlvbiBzdXJnZVBsYXRmb3JtSGFuZGxlcihkb21haW4sIG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gIGNvbnNvbGUubG9nKCdUT0RPOiBJbXBsZW1lbnQgdGhpcyBpbnRlcm5hbGx5JylcbiAgY29uc29sZS5sb2coJ1J1biB0aGlzOicpXG4gIGNvbnNvbGUubG9nKClcbiAgY29uc29sZS5sb2coYHN1cmdlIGRlcGxveSAtLXByb2plY3QgJHsgb3B0aW9ucy5wdWJsaWMgfSAtLWRvbWFpbiAkeyBkb21haW4gfSAtLWVuZHBvaW50ICR7IG9wdGlvbnMuZW5kcG9pbnQgfWAueWVsbG93KVxufVxuXG5mdW5jdGlvbiBzdXJnZUhhbmRsZXIoZG9tYWluLCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICBjb25zb2xlLmxvZygnVE9ETzogSW1wbGVtZW50IHRoaXMgaW50ZXJuYWxseScpXG4gIGNvbnNvbGUubG9nKCdSdW4gdGhpczonKVxuICBjb25zb2xlLmxvZygpXG4gIGNvbnNvbGUubG9nKGBzdXJnZSBkZXBsb3kgLS1wcm9qZWN0ICR7IG9wdGlvbnMucHVibGljIH0gLS1kb21haW4gJHsgb3B0aW9ucy5kb21haW4gfWApXG59XG5cbmZ1bmN0aW9uIGF3c0hhbmRsZXIoZG9tYWluLCBvcHRpb25zID0ge30pIHtcbiAgY29uc29sZS5sb2coJ1RPRE86IEltcGxlbWVudCB0aGlzIGludGVybmFsbHknKVxufVxuIl19