import BundleWrapper from './wrapper'

export function ProjectLoader(bundle, options = {}) {
  return BundleWrapper.create(bundle)
}

export default ProjectLoader
