# Actions

Actions are functions that can be exposed via an interface.  Their purpose is to provide a way for outside systems to interact with the project, or to facilitate using the project content or data to interact with the outside world.  The Skypager framework provides its own core actions, Plugins can provide actions, and each Project can define its own set of actions as well.

## Usage

Actions can be as simple as a single function which gets exported by a module.

```js
module.exports = function MyAction(params = {}, context = {}) {

}
```

This action can be loaded into the project by:

```js
import skypager from 'skypager'

const project = skypager.load(process.env.PWD)

project.actions.load(
    require('./actions/my_action'), {
      id: 'actions/my_action',
      uri: require.resolve('./actions/my_action')
    }
)
```

**Note:** the `id` and `uri` values being passed to the registry are how the actions registry can automatically generate documentation and other interfaces, and make the action code itself something that can be edited through the author desktop app or skypager platform website.

## Action Definitions

Actions can be defined using a special DSL that serves the dual purpose of generating documentation and machine readable interface specs, at the same time that it implements the actions functionality.

Here is an example of an action definition used by the `skypager-plugin-portfolio` module.

```js
action('Run a command for each package')

describe('Runs an npm script for each package')

cli(function (program, dispatch){
  var action = this

  program
    .command('each <group>')
    .description(action.definition.description)
    .option('--group <group>', 'which group of module do you want to loop over? project or package', 'package')
    .option('--command <command>', 'which command to run in this package directory')
    .option('--exclude <list>','exclude a comma separated list of package names')
    .option('--include <list>','include a comma separated list of package names')
    .action(dispatch(action.api.runner))

  return program
})

execute(function(group, params, context) {
  group = group || params.group
  params.group = group

  var project = context.project
  var shell = require('shelljs')

  var args = params.command.split(' ')
  var cmd = args.shift()
  var dirname = require('path').dirname
  var pull = require('lodash/pull')

  var include, exclude, group

  switch(group) {
    case 'project', 'projects':
      include = params.include ? project.projects.glob(params.include) : project.projects.query()
      exclude = params.exclude ? project.projects.glob(params.exclude) : []
      break;
    case 'package', 'packages':
    default:
      include = params.include ? project.packages.glob(params.include) : project.packages.query()
      exclude = params.exclude ? project.packages.glob(params.exclude) : []
  }

  let paths = include.map(a => a.paths.absolute)

  if (exclude.length > 0) {
    pull(include, exclude)
  }

  if (cmd === 'npm' && args[0] === 'run') {
    include = include.filter(pkg =>
      args[1] && pkg.data && pkg.data.scripts && pkg.data.scripts[ args[1] ]
    )
  }

  include.forEach(function(pkg){
    var child = require('child_process').spawn(cmd, args, {
      cwd: dirname(pkg.paths.absolute),
      stdio:['inherit','inherit']
    })

    child.on('end', function(){
      console.log('Finished'.green + ' ' + pkg.data.name)
    })

    child.on('error', function(){
       console.log('Error'.red + ' in ' + pkg.data.name )
    })
  })
})

```

Any project which uses the `skypager-plugin-portfolio` plugin will have the action available to it.

Because this action exposes a CLI interface, we can interact with it via the `skypager` CLI tool:

Running the help command

```bash
skypager --help
```

Will show that the `skypager each package` command is available:


It can be used like this:

```bash
skypager each package --command='npm run compile'
```

This will dispatch the CLI request to the action, which will get run in the context of the skypager project.

### Action Runners

As with all of the project helpers, they can be run directly from the project object itself:

```js
project.actions.run('packages/each', {
  command: 'npm run compile'
})
```

By making the call this way, the `execute` method defined above can assume certain things. 

It will always have access to the context object as the final argument it is called with, for example.  It will always run where `this` is the project.  In addition, certain helper utilities will always be available in the global scope.



