import BundleWrapper from './bundle_wrapper'

export function ProjectLoader(bundle, options = {}) {
  bundle = bundle || require('dist/bundle')

  return BundleWrapper.create(bundle)
}

export default ProjectLoader
