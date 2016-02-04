import { Application } from 'skypager-application'

function loadApp (bundle, hot = false) {
  Application.create({
    root: 'app',
    bundle,
    hot
  })
}

loadApp(
  require('dist/bundle')
)

if (module.hot) {
  module.hot.accept('dist/bundle', ()=>{
    loadApp(
      require('dist/bundle'),
      true
    )
  })
}
