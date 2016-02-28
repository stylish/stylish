/**
 * The resolver is responsible for mapping short hand aliases and reference
 * used throughout our assets, and especially documents, to the appropriate
 * helpers or assets within the project.
 *
 * Documents are resolved to a modelClass first by analyzing the parent folder
 * they belong to, then their YAML frontmatter by looking for a type property.
 *
 * In certain cases where neither of the above are convenient, regex patterns can
 * be defined which will map a path to the appropriate model.
 */
import { defaults, singularize } from './util'

const { keys, assign } = Object

module.exports = function createResolver () {
  let project = this
  let options = project.options.resolver || project.settings.resolver || project.options || {}

  defaults(options, {
    modelPatterns: {}
  })

  if (project.get('settings.resolver.modelPatterns')) {
    options.modelPatterns = assign(options.modelPatterns, project.get('settings.resolver.modelPatterns'))
  }

  let asset 	= (options.assetResolver || assetResolver).bind(project)
  let link 		= (options.linkResolver || linkResolver).bind(project)
  let model 	= (options.modelResolver || modelResolver).bind(project)

  let patterns = {
    models: addInterface({}),
    links: addInterface({}),
    assets: addInterface({})
  }

  keys(options.modelPatterns)
    .forEach((result, pattern) => {
      if (pattern = options.modelPatterns[result]) {
        patterns.models.add(pattern, result)
      }
    })

  return {
    asset,
    link,
    model,
    patterns,
    models: model
  }
}

function addInterface (cache) {
  assign(cache, {
    items: {},

    add (pattern, result) {
      if (typeof pattern === 'string') {
        pattern = new RegExp(pattern)
      }

      assign(cache.items, {
        get [result] () {
          return pattern
        }
      })
    }
  })

  return cache
}

function testPatterns (value, items) {
  if (!value) {
    return false
  }

  let matching = Object.keys(items).filter(key => {
    let pattern = items[key]

    if (pattern && pattern.test && pattern.test(value.toString())) {
      return true
    } else {

    }
  })

  if (matching && matching[0]) {
    return matching[0]
  }
}

function modelResolver (subject, options = {}) {
  let project = this
  let registry = project.models
  let guesses = [ ]
  let result

  if (typeof (subject) === 'string') {
    guesses.push(subject)
    guesses.push(singularize(subject))

    if (subject.match(/\//)) {
      guesses.push(testPatterns(subject, project.resolve.patterns.models.items))
    }
  }

  // if we are given a doc work with that
  if (typeof (subject) !== 'string' && subject.uri) {
    if (subject && subject.type) { guesses.push(subject.type) }
    if (subject && subject.groupName) { guesses.push(subject.groupName) }
    guesses.push(subject.dirname)
    guesses.push(subject.uri)
    guesses.push(subject.parentdir)
  }

  let found

  while (!found && guesses.length > 0) {
    let guess = guesses.shift()
    found = guess && registry.lookup(guess, false)

    if (!found && (result = testPatterns(guess, project.resolve.patterns.models.items))) {
      found = registry.lookup(result, false)
    }
  }

  if (found) {
    return found
  }
}

/**
* determines the values to be used for href in markdown link tags. generally depends on hosting environment.
*/
function linkResolver (original, options = {}) {
  return original
}

/**
* determines the value to be used for asset urls. generally depends on the hosting environment
*/
function assetResolver (original, options = {}) {
  return original
}
