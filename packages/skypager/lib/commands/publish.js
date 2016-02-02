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

  if (options.service === 'skypager') {
    options.service = 'skypager.io';
  }
  if (options.service === 'blueprint') {
    options.service = 'blueprint.io';
  }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9wdWJsaXNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBR2dCLE9BQU8sR0FBUCxPQUFPO1FBY1AsTUFBTSxHQUFOLE1BQU07Ozs7QUFkZixTQUFTLE9BQU8sQ0FBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQzFDLFNBQU8sQ0FDSixPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FDM0IsV0FBVyxDQUFDLCtEQUErRCxDQUFDLENBQzVFLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxrQ0FBa0MsQ0FBQyxDQUMvRCxNQUFNLENBQUMsVUFBVSxFQUFFLHNFQUFzRSxDQUFDLENBQzFGLE1BQU0sQ0FBQyxTQUFTLEVBQUUsNkJBQTZCLENBQUMsQ0FDaEQsTUFBTSxDQUFDLGlCQUFpQixFQUFFLHFCQUFxQixDQUFDLENBQ2hELE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxzRUFBc0UsRUFBRSxVQUFVLENBQUMsQ0FDaEgsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQzVCOztrQkFFYyxPQUFPO0FBRWYsU0FBUyxNQUFNLENBQUMsTUFBTSxFQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7TUFDakQsT0FBTyxHQUFLLE9BQU8sQ0FBbkIsT0FBTzs7QUFFYixRQUFNLEdBQUcsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUE7QUFDM0QsU0FBTyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFBOztBQUV2RCxNQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssVUFBVSxFQUFFO0FBQUUsV0FBTyxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUE7R0FBRTtBQUN2RSxNQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssV0FBVyxFQUFFO0FBQUUsV0FBTyxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUE7R0FBRTs7QUFFekUsTUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLGNBQWMsSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLGFBQWEsRUFBRTtBQUMzRSxXQUFPLENBQUMsUUFBUSxjQUFhLE9BQU8sQ0FBQyxPQUFPLEFBQUcsQ0FBQTtBQUMvQyx3QkFBb0IsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0dBQy9DLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMxQyxnQkFBWSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7R0FDdkM7Q0FDRjs7QUFFRCxTQUFTLG9CQUFvQixDQUFDLE1BQU0sRUFBOEI7TUFBNUIsT0FBTyx5REFBRyxFQUFFO01BQUUsT0FBTyx5REFBRyxFQUFFOztBQUM5RCxTQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUE7QUFDOUMsU0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUN4QixTQUFPLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDYixTQUFPLENBQUMsR0FBRyxDQUFDLDZCQUEyQixPQUFPLENBQUMsTUFBTSxrQkFBZSxNQUFNLG9CQUFpQixPQUFPLENBQUMsUUFBUSxFQUFJLE1BQU0sQ0FBQyxDQUFBO0NBQ3ZIOztBQUVELFNBQVMsWUFBWSxDQUFDLE1BQU0sRUFBOEI7TUFBNUIsT0FBTyx5REFBRyxFQUFFO01BQUUsT0FBTyx5REFBRyxFQUFFOztBQUN0RCxTQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUE7QUFDOUMsU0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUN4QixTQUFPLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDYixTQUFPLENBQUMsR0FBRyw2QkFBNEIsT0FBTyxDQUFDLE1BQU0sa0JBQWUsT0FBTyxDQUFDLE1BQU0sQ0FBSSxDQUFBO0NBQ3ZGOztBQUVELFNBQVMsVUFBVSxDQUFDLE1BQU0sRUFBZ0I7TUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQ3RDLFNBQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQTtDQUMvQyIsImZpbGUiOiJwdWJsaXNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQdWJsaXNoIHRoZSBwcm9qZWN0IHRvIGEgc2VydmljZSBzdWNoIGFzIFN1cmdlLCBvciBBV1NcbiovXG5leHBvcnQgZnVuY3Rpb24gcHVibGlzaCAocHJvZ3JhbSwgZGlzcGF0Y2gpIHtcbiAgcHJvZ3JhbVxuICAgIC5jb21tYW5kKCdwdWJsaXNoIFtkb21haW5dJylcbiAgICAuZGVzY3JpcHRpb24oJ3B1Ymxpc2ggYSB3ZWJzaXRlIGZvciB0aGlzIHByb2plY3QgdG8gY2xvdWQgaG9zdGluZyBwbGF0Zm9ybXMnKVxuICAgIC5vcHRpb24oJy0tZG9tYWluIDxkb21haW4+JywgJ3doaWNoIGRvbWFpbiB0byBwdWJsaXNoIHRoaXMgdG8/JylcbiAgICAub3B0aW9uKCctLXB1YmxpYycsICd3aGljaCBmb2xkZXIgc2hvdWxkIHdlIHB1Ymxpc2g/IGRlZmF1bHRzIHRvIHRoZSBwcm9qZWN0cyBwdWJsaWMgcGF0aCcpXG4gICAgLm9wdGlvbignLS1idWlsZCcsICdydW4gdGhlIGJ1aWxkIHByb2Nlc3MgZmlyc3QnKVxuICAgIC5vcHRpb24oJy0tYnVpbGQtY29tbWFuZCcsICd3aGljaCBidWlsZCBjb21tYW5kJylcbiAgICAub3B0aW9uKCctLXNlcnZpY2UgPGRvbWFpbj4nLCAnd2hpY2ggc2VydmljZSBzaG91bGQgd2UgcHVibGlzaCB0bz8gYXdzLCBzdXJnZS5zaCwgc29tZSBvdGhlciBkb21haW4nLCAnc3VyZ2Uuc2gnKVxuICAgIC5hY3Rpb24oZGlzcGF0Y2goaGFuZGxlKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgcHVibGlzaFxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlKGRvbWFpbiwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgbGV0IHsgcHJvamVjdCB9ID0gY29udGV4dFxuXG4gIGRvbWFpbiA9IGRvbWFpbiB8fCBvcHRpb25zLmRvbWFpbiB8fCBwcm9qZWN0Lm9wdGlvbnMuZG9tYWluXG4gIG9wdGlvbnMucHVibGljID0gb3B0aW9ucy5wdWJsaWMgfHwgcHJvamVjdC5wYXRocy5wdWJsaWNcblxuICBpZiAob3B0aW9ucy5zZXJ2aWNlID09PSAnc2t5cGFnZXInKSB7IG9wdGlvbnMuc2VydmljZSA9ICdza3lwYWdlci5pbycgfVxuICBpZiAob3B0aW9ucy5zZXJ2aWNlID09PSAnYmx1ZXByaW50JykgeyBvcHRpb25zLnNlcnZpY2UgPSAnYmx1ZXByaW50LmlvJyB9XG5cbiAgaWYgKG9wdGlvbnMuc2VydmljZSA9PT0gJ2JsdWVwcmludC5pbycgfHwgb3B0aW9ucy5zZXJ2aWNlID09PSAnc2t5cGFnZXIuaW8nKSB7XG4gICAgb3B0aW9ucy5lbmRwb2ludCA9IGBzdXJnZS4keyBvcHRpb25zLnNlcnZpY2UgfWBcbiAgICBzdXJnZVBsYXRmb3JtSGFuZGxlcihkb21haW4sIG9wdGlvbnMsIGNvbnRleHQpXG4gIH0gZWxzZSBpZiAob3B0aW9ucy5zZXJ2aWNlLm1hdGNoKC9zdXJnZS9pKSkge1xuICAgIHN1cmdlSGFuZGxlcihkb21haW4sIG9wdGlvbnMsIGNvbnRleHQpXG4gIH1cbn1cblxuZnVuY3Rpb24gc3VyZ2VQbGF0Zm9ybUhhbmRsZXIoZG9tYWluLCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICBjb25zb2xlLmxvZygnVE9ETzogSW1wbGVtZW50IHRoaXMgaW50ZXJuYWxseScpXG4gIGNvbnNvbGUubG9nKCdSdW4gdGhpczonKVxuICBjb25zb2xlLmxvZygpXG4gIGNvbnNvbGUubG9nKGBzdXJnZSBkZXBsb3kgLS1wcm9qZWN0ICR7IG9wdGlvbnMucHVibGljIH0gLS1kb21haW4gJHsgZG9tYWluIH0gLS1lbmRwb2ludCAkeyBvcHRpb25zLmVuZHBvaW50IH1gLnllbGxvdylcbn1cblxuZnVuY3Rpb24gc3VyZ2VIYW5kbGVyKGRvbWFpbiwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgY29uc29sZS5sb2coJ1RPRE86IEltcGxlbWVudCB0aGlzIGludGVybmFsbHknKVxuICBjb25zb2xlLmxvZygnUnVuIHRoaXM6JylcbiAgY29uc29sZS5sb2coKVxuICBjb25zb2xlLmxvZyhgc3VyZ2UgZGVwbG95IC0tcHJvamVjdCAkeyBvcHRpb25zLnB1YmxpYyB9IC0tZG9tYWluICR7IG9wdGlvbnMuZG9tYWluIH1gKVxufVxuXG5mdW5jdGlvbiBhd3NIYW5kbGVyKGRvbWFpbiwgb3B0aW9ucyA9IHt9KSB7XG4gIGNvbnNvbGUubG9nKCdUT0RPOiBJbXBsZW1lbnQgdGhpcyBpbnRlcm5hbGx5Jylcbn1cbiJdfQ==