action('create users')

cli(function(program, dispatch) {
  let action = this

  program
    .command('create:user <email> <password>')
    .option('--role', 'which role should this user be assigned', 'user')
    .option('--organization', 'which organization is this user a member', 'default')
    .action(dispatch(action.api.runner))
})

execute(function(email, password, options = {}, context) {
  let defaults = require('lodash').defaults
  let { project } = context
  let { role, organization } = defaults(options, {
    role: 'user',
    organization: 'public'
  })

  let service = require('deepstream.io-client-js')
  let { deepstream } = project.settings.integrations

  if (!deepstream) {
    throw('Must specify deepstream configuration in the project settings integrations.yml')
  }

  let ds

  try {
    let connection = `${ deepstream.host || 'localhost' }:${ deepstream.port || 6021 }`

    ds = service(connection).login(null, (success, errorMessage, errorCode) => {
      if(!success) {
        console.log('Error connecting to deepstream server', errorMessage, errorCode)
        process.exit(1)
      }
    })
  } catch (error) {
    console.log('error', error.message)
    process.exit(1)
  }

  ds.on('error', (...args)=> {
    console.log('DS Error', ...args)
  })

  try {
    let user = ds.record.getRecord(`users/${ organization }/${ email }`)

    user.whenReady(()=> {
      user.set({
         email,
         organization,
         role
      })

      console.log(user.get())
    })

  } catch(error) {
    console.log('error getting record')
    console.log(error.message)
  }
})

