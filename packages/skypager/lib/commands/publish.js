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
  program.command('publish [domain]').description('publish a website for this project to cloud hosting platforms').option('--domain <domain>', 'which domain to publish this to?').option('--public', 'which folder should we publish? defaults to the projects public path').option('--build', 'run the build process first').option('--build-command', 'which build command').option('--service <domain>', 'which service should we publish to? aws, surge.sh, some other domain', 'surge.sh').action(dispatch(handle));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9wdWJsaXNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBR2dCLE9BQU8sR0FBUCxPQUFPO1FBY1AsTUFBTSxHQUFOLE1BQU07Ozs7QUFkZixTQUFTLE9BQU8sQ0FBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQzFDLFNBQU8sQ0FDSixPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FDM0IsV0FBVyxDQUFDLCtEQUErRCxDQUFDLENBQzVFLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxrQ0FBa0MsQ0FBQyxDQUMvRCxNQUFNLENBQUMsVUFBVSxFQUFFLHNFQUFzRSxDQUFDLENBQzFGLE1BQU0sQ0FBQyxTQUFTLEVBQUUsNkJBQTZCLENBQUMsQ0FDaEQsTUFBTSxDQUFDLGlCQUFpQixFQUFFLHFCQUFxQixDQUFDLENBQ2hELE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxzRUFBc0UsRUFBRSxVQUFVLENBQUMsQ0FDaEgsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQzVCOztrQkFFYyxPQUFPO0FBRWYsU0FBUyxNQUFNLENBQUMsTUFBTSxFQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7TUFDakQsT0FBTyxHQUFLLE9BQU8sQ0FBbkIsT0FBTzs7QUFFYixRQUFNLEdBQUcsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUE7QUFDM0QsU0FBTyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFBOztBQUV2RCxNQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssY0FBYyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssYUFBYSxFQUFFO0FBQzNFLFdBQU8sQ0FBQyxRQUFRLGNBQWEsT0FBTyxDQUFDLE9BQU8sQUFBRyxDQUFBO0FBQy9DLHdCQUFvQixDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7R0FDL0MsTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzFDLGdCQUFZLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtHQUN2QztDQUNGOztBQUVELFNBQVMsb0JBQW9CLENBQUMsTUFBTSxFQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQzlELFNBQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQTtBQUM5QyxTQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ3hCLFNBQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUNiLFNBQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTJCLE9BQU8sQ0FBQyxNQUFNLGtCQUFlLE1BQU0sb0JBQWlCLE9BQU8sQ0FBQyxRQUFRLEVBQUksTUFBTSxDQUFDLENBQUE7Q0FDdkg7O0FBRUQsU0FBUyxZQUFZLENBQUMsTUFBTSxFQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQ3RELFNBQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQTtBQUM5QyxTQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ3hCLFNBQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUNiLFNBQU8sQ0FBQyxHQUFHLDZCQUE0QixPQUFPLENBQUMsTUFBTSxrQkFBZSxPQUFPLENBQUMsTUFBTSxDQUFJLENBQUE7Q0FDdkY7O0FBRUQsU0FBUyxVQUFVLENBQUMsTUFBTSxFQUFnQjtNQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDdEMsU0FBTyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFBO0NBQy9DIiwiZmlsZSI6InB1Ymxpc2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFB1Ymxpc2ggdGhlIHByb2plY3QgdG8gYSBzZXJ2aWNlIHN1Y2ggYXMgU3VyZ2UsIG9yIEFXU1xuKi9cbmV4cG9ydCBmdW5jdGlvbiBwdWJsaXNoIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ3B1Ymxpc2ggW2RvbWFpbl0nKVxuICAgIC5kZXNjcmlwdGlvbigncHVibGlzaCBhIHdlYnNpdGUgZm9yIHRoaXMgcHJvamVjdCB0byBjbG91ZCBob3N0aW5nIHBsYXRmb3JtcycpXG4gICAgLm9wdGlvbignLS1kb21haW4gPGRvbWFpbj4nLCAnd2hpY2ggZG9tYWluIHRvIHB1Ymxpc2ggdGhpcyB0bz8nKVxuICAgIC5vcHRpb24oJy0tcHVibGljJywgJ3doaWNoIGZvbGRlciBzaG91bGQgd2UgcHVibGlzaD8gZGVmYXVsdHMgdG8gdGhlIHByb2plY3RzIHB1YmxpYyBwYXRoJylcbiAgICAub3B0aW9uKCctLWJ1aWxkJywgJ3J1biB0aGUgYnVpbGQgcHJvY2VzcyBmaXJzdCcpXG4gICAgLm9wdGlvbignLS1idWlsZC1jb21tYW5kJywgJ3doaWNoIGJ1aWxkIGNvbW1hbmQnKVxuICAgIC5vcHRpb24oJy0tc2VydmljZSA8ZG9tYWluPicsICd3aGljaCBzZXJ2aWNlIHNob3VsZCB3ZSBwdWJsaXNoIHRvPyBhd3MsIHN1cmdlLnNoLCBzb21lIG90aGVyIGRvbWFpbicsICdzdXJnZS5zaCcpXG4gICAgLmFjdGlvbihkaXNwYXRjaChoYW5kbGUpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBwdWJsaXNoXG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGUoZG9tYWluLCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICBsZXQgeyBwcm9qZWN0IH0gPSBjb250ZXh0XG5cbiAgZG9tYWluID0gZG9tYWluIHx8IG9wdGlvbnMuZG9tYWluIHx8IHByb2plY3Qub3B0aW9ucy5kb21haW5cbiAgb3B0aW9ucy5wdWJsaWMgPSBvcHRpb25zLnB1YmxpYyB8fCBwcm9qZWN0LnBhdGhzLnB1YmxpY1xuXG4gIGlmIChvcHRpb25zLnNlcnZpY2UgPT09ICdibHVlcHJpbnQuaW8nIHx8IG9wdGlvbnMuc2VydmljZSA9PT0gJ3NreXBhZ2VyLmlvJykge1xuICAgIG9wdGlvbnMuZW5kcG9pbnQgPSBgc3VyZ2UuJHsgb3B0aW9ucy5zZXJ2aWNlIH1gXG4gICAgc3VyZ2VQbGF0Zm9ybUhhbmRsZXIoZG9tYWluLCBvcHRpb25zLCBjb250ZXh0KVxuICB9IGVsc2UgaWYgKG9wdGlvbnMuc2VydmljZS5tYXRjaCgvc3VyZ2UvaSkpIHtcbiAgICBzdXJnZUhhbmRsZXIoZG9tYWluLCBvcHRpb25zLCBjb250ZXh0KVxuICB9XG59XG5cbmZ1bmN0aW9uIHN1cmdlUGxhdGZvcm1IYW5kbGVyKGRvbWFpbiwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgY29uc29sZS5sb2coJ1RPRE86IEltcGxlbWVudCB0aGlzIGludGVybmFsbHknKVxuICBjb25zb2xlLmxvZygnUnVuIHRoaXM6JylcbiAgY29uc29sZS5sb2coKVxuICBjb25zb2xlLmxvZyhgc3VyZ2UgZGVwbG95IC0tcHJvamVjdCAkeyBvcHRpb25zLnB1YmxpYyB9IC0tZG9tYWluICR7IGRvbWFpbiB9IC0tZW5kcG9pbnQgJHsgb3B0aW9ucy5lbmRwb2ludCB9YC55ZWxsb3cpXG59XG5cbmZ1bmN0aW9uIHN1cmdlSGFuZGxlcihkb21haW4sIG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gIGNvbnNvbGUubG9nKCdUT0RPOiBJbXBsZW1lbnQgdGhpcyBpbnRlcm5hbGx5JylcbiAgY29uc29sZS5sb2coJ1J1biB0aGlzOicpXG4gIGNvbnNvbGUubG9nKClcbiAgY29uc29sZS5sb2coYHN1cmdlIGRlcGxveSAtLXByb2plY3QgJHsgb3B0aW9ucy5wdWJsaWMgfSAtLWRvbWFpbiAkeyBvcHRpb25zLmRvbWFpbiB9YClcbn1cblxuZnVuY3Rpb24gYXdzSGFuZGxlcihkb21haW4sIG9wdGlvbnMgPSB7fSkge1xuICBjb25zb2xlLmxvZygnVE9ETzogSW1wbGVtZW50IHRoaXMgaW50ZXJuYWxseScpXG59XG4iXX0=