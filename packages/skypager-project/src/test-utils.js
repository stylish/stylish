/**
*
* EXPERIMENTAL
*
* I want to find a way of wrapping the should library and responding
* to failures by logging them, instead of halting execution.
*
* This will allow models to export functions which contain a bunch of specifications:
*
* object.please - suggestion, can be silenced
* object.should - advice, warns on failure, can't be silenced easily
* object.must - requirement, failure is not optional
*
* and these functions can be used to validate a given document meets the requirements to be used as an entity
*/

import { hide } from './util'
import should from 'should/as-function'

/**
*
* Returns a spec interface for the passed object.
*
* @example
*
*   function validator(objectUnderTest, spec){
*     let { please, should, must, report } = spec(objectUnderTest)
*     must.be.a.Function || report('This needs to be a function')
*     please.have.name.match(/^something/) || report('Function name should start with something')
*     return report
*   }
*
* @return SpecInterface an object with please, must, should, and report objects which can be used
*   to write requirements for the object's interface, with different consequences for failure.
*/
export function specInterface (subject, options = {}) {
  return spec(subject, options)
}

/**
* wraps a spec function which expects to be passed an object under test, and an object that
* will provide this function with the tools it needs to write requirements and report on their failure.
*
* a validator function will never throw errors or break execution, it will return false.  details about
* any failures or errors wil be available on the report for this function.
*
* @return Report returns an instance of the Report class
*
*/
export function runSpecFunction (validator, subject, scope, ...rest) {
  let report = new Reporter(subject)
  let spec = specInterface(subject, {report})

  let result

  try {
    result = validator.call(scope, subject, spec, ...rest)
  } catch (error) {

  }

  report.result = result

  return report
}

class Reporter {
  constructor () {
    this.reminders = []
    this.errors = []
    this.warnings = []
  }

  set reminder (value) {
    this.reminders.push(value)
  }

  set warning (value) {
    this.warnings.push(value)
  }

  set error (value) {
    this.errors.push(value)
  }

  get success () {
    this.errors.length === 0
  }
}

function spec (subject, options = {}) {
  let report = options.report || new Reporter(subject, options)

  let warn = function () {
    let w = should(subject)
    w.seriousness = 'warn'
    // find some way to tap into the errors and respond sternly
    return w
  }

  let must = function () {
    let m = should(subject)
    // find some way to tap into the errors and respond harshly
    m.seriousness = 'force'
    return m
  }

  let please = function () {
    let p = should(subject)
    // find some way to tap into the errors and respond nicely
    m.seriousness = 'remind'
    return p
  }

  return {
    should: wrapItUp(warn),
    please: wrapItUp(please),
    must: wrapItUp(must),
    report: report
  }
}

// wraps up one of the how serious are you about this advice methods
function wrapItUp (fn) {
  let chainMethods = [
    'an', 'of', 'a', 'and', 'be', 'have', 'with', 'is'
  ]

  chainMethods.forEach(chain => hide.getter(fn, chain, fn, false))
}


