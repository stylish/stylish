/**
 * Including the bundling and optimization of third party libraries
 * such as React, Bootstrap, or jQuery should not be something we need
 * to do in every development session.  We should let the system handle caching
 * these builds for us in order to optimize development build times.
 *
 * Webpack can handle this in multiple ways with different configuration options
 * and plugin combinations.
 *
 * We can also precompile HTML templates and the dependency bundles, and only inject
 * our Webpack Entry script in development, so that we can develop and get hot reloading
 * feedback in the browser with near instantaneous updates.
 */

import defaults from 'lodash/object/defaults'

export function Dependencies (options = {}) {
  const { bundles } = require('../../dist/settings.json')

  if (!validate(options)) {
    return
  }

  let { bundle } = options
  let vendor = bundles[bundle]

  return (config) => {
    config.merge({
      entry: {
        vendor
      }
    })
  }
}

export function validate (options = {}, report) {
  if (!bundles[options.bundle]) {
    report.error('Invalid dependency bundle selected')
  }

  return report.valid
}

export default Dependencies
