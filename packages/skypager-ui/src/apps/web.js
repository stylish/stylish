import WebApp from 'ui/shells/WebApp'
import BundleLoader from 'ui/bundle/loader'

require.ensure([], (require) => {
  const bundle = BundleLoader(
    require('dist/bundle')
  )

  WebApp.create({
    bundle
  })
}, 'project-bundle')
