import WebApp from 'ui/shells/WebApp'
import BundleLoader from 'ui/bundle/loader'

const bundle = BundleLoader(
  require('dist/bundle')
)

WebApp.create({
  bundle
})
