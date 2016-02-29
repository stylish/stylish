import { singularize, keys, assign } from './util'

module.exports = function createResolver () {
  let project = this
	    let options = project.options.resolver || project.options || {}

	    let asset 	= (options.assetResolver || assetResolver).bind(project)
	    let link 		= (options.linkResolver || linkResolver).bind(project)
	    let model 	= (options.modelResolver || modelResolver).bind(project)

  let patterns = {
    models: addInterface({}),
    links: addInterface({}),
    assets: addInterface({})
  }

  if (options.modelPatterns) {
    Object.keys(options.modelPatterns).forEach((result, pattern) => {
      if (pattern = options.modelPatterns[result]) {
        patterns.models.add(pattern, result)
      }
    })
  }

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
    guesses.push(subject.uri)
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
