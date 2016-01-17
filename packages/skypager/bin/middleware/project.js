export function currentProject(request = {}, next) {
  let { argv, exists, pwd, skypager } = this
  let { pkg } = request

  let options = {manifest: pkg}

  let foundProject

  if (argv.project && exists(argv.project)) {
    if(foundProject = argv.project) {
      request.project = skypager.load(require.resolve(pwd(foundProject)), Object.assign({}, options, argv))
    }
  } else if (process.env.SKYPAGER_PROJECT_PATH) {
    foundProject = exists(process.env.SKYPAGER_PROJECT_PATH) && resolve(process.env.SKYPAGER_PROJECT_PATH)
    if (foundProject) {
      request.project = skypager.load(foundProject, Object.assign({}, options, argv))
    }
  } else if (exists(pwd('skypager.json'))) {
    options = Object.assign(options, readFile(pwd('skypager.json')))
    options.manifest = Object.assign(options.manifest || {}, readFile(pwd('skypager.json')))
    foundProject = pwd('skypager.json')
    request.project = skypager.load(foundProject, options)
  } else if (pkg.skypager && pkg.skypager.main && exists(pwd(pkg.skypager.main))) {
    options = Object.assign(options, pkg.skypager)
    foundProject = pwd(pkg.skypager.main)
    request.project = require(foundProject)
  }

  next()
}

export default currentProject
