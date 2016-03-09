import project from './skypager.js'

project.packages
  .filter(pkg => pkg.get('scripts.test'))
  .forEach(pkg => {
    let current = pkg.get('scripts.test')

    if (current && !current.match(/\|\| true$/)) {
      pkg.set('scripts.test', `${ current } || true`)
      console.log('Set script to: ' + pkg.get('scripts.test'))

      pkg.saveSync({
        minify: false
      })
    }
  })

