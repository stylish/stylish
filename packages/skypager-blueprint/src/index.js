import WebApp from 'ui/shells/WebApp'
import BundleLoader from 'ui/bundle/loader'

const project = BundleLoader(
  require('dist/bundle')
)

WebApp.create({
  project
})
