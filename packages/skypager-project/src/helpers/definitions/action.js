import { any, assign, noConflict, tabelize, parameterize, singularize, underscore } from '../../util'


const route = require('path-match')({
  sensitive: false,
  strict: false,
  end: false
})

let tracker = { }
let _curr

function current () { return tracker[_curr] }
function clearDefinition () { _curr = null; delete tracker[_curr] }

/**
 * An ActionDefinition is created automatically when an action file is loaded
 * by the actions registry.  A standard action file starts with:
 *
 * @example
 *
 *  action('MyAction')
 *
 *  execute(function(params = {}, context = {project}){
 *
 *  })
 */
export class ActionDefinition {
  constructor (actionName) {
    this.name = actionName
    this.description = ''
    this.config = {}
    this.interfaces = {}
    this.parameters = { }
    this.aliases = {}
    this.validator = function () { return true }
    this.executor = function () { throw ('Define your own executor function') }
    this.config.pathMatchers = []
  }

  describe(value) {
    this.description = value
  }

  expose (platform, configurator) {
    this.interfaces[platform] = configurator
  }

  addCommandPhrase(phrase){
    this.config.pathMatchers.push(
      route((phrase.trim()).replace(/\s/g, '/'))
    )
  }

  addRouteMatcher(rule){
    this.config.pathMatchers.push(
      route(rule)
    )
  }

  testRoute(path){
   let matching = this.config.pathMatchers.find(rule => rule(path))
   return matching && matching(path)
  }

  testCommand(phrase){
    let sample = trim(phrase).replace(/\s/g, '/')
    let matching = this.config.pathMatchers.find(rule => rule(sample))
    return matching && matching(sample)
  }

  get api () {
    let def = this

    return {
      name: this.name,
      aliases: this.aliases,
      testCommand: this.testCommand.bind(this),
      testRoute: this.testRoute.bind(this),
      execute: this.executor,
      validate: this.validator,
      parameters: this.parameters,
      runner: function (...args) {
        let report = {
          errors:[],
          suggestions: [],
          warnings:[]
        }

        let context = args[ args.length - 1 ]

        let localHelpers = {
           abort(message, ...r) {
              console.error(message)
              report.errors.push(message, ...r)
              process.exit(1)
            },
            error(message, ...r) {
              console.log(message.red, ...r)
              report.errors.push(message)
            },
            warn(message, ...r) {
              console.log(message.yellow, ...r)
              report.warnings.push(message)
            },
            suggest(message, ...r) {
              console.log(message.white, ...r)
              report.suggestions.push(message)
            },
            report,
            context
        }

        context.report = report

        let passesValidation = noConflict(function(){
          return def.api.validate(...args)
        }, localHelpers)(...args)

        if (passesValidation === false) {
          report.success = false
          return report
        }

        report.result = noConflict(function(){
          try {
            let r = def.api.execute(...args)
            if (r) { report.success = true }
            return r
          } catch(err) {
            report.errors.push('fatal error:' + err.message)
          }
        }, localHelpers)(...args)

        return report
      }
    }
  }

  aka (...list) {
    list.forEach(alias => {
      this.aliases[ parameterize(underscore(alias.toLowerCase())) ] = true
    })
  }

  aliases (...list) {
    this.aka(...list)
  }

  pathMatchers(...args) {

  }

  params (...args) {
    this.configureParameters(...args)
  }

  validate (fn) {
    this.validator = fn
  }

  execute (fn) {
    this.executor = fn
  }

  configureParameters(inputs) {

  }
}

ActionDefinition.current = current
ActionDefinition.clearDefinition = clearDefinition

export function DSL (fn) {
  noConflict(fn, DSL)()
}

export function lookup(actionName) {
  return tracker[(_curr = tabelize(parameterize(actionName)).toLowerCase())]
}

assign(DSL, {
  action: function (actionName) {
    tracker[(_curr = tabelize(parameterize(actionName)))] = new ActionDefinition(actionName)
  },
  describe: function (...args) { tracker[_curr].describe(...args) },
  aliases: function (...args) { tracker[_curr].aliases(...args) },
  aka: function (...args) { tracker[_curr].aka(...args) },
  validate: function (...args) { tracker[_curr].validate(...args) },
  execute: function (...args) { tracker[_curr].execute(...args) },
  required: function (...args) { tracker[_curr].required(...args) },
  optional: function (...args) { tracker[_curr].optional(...args) },
  params: function (...args) { tracker[_curr].params(...args) },
  commandPhrase: function (...args) { tracker[_curr].addCommandPhrase(...args) },
  route: function (...args) { tracker[_curr].addRouteMatcher(...args) },
  expose: function(...args) { tracker[_curr].expose(...args) },
  cli: function(...args) { tracker[_curr].expose('cli', ...args) },
  ipc: function(...args) { tracker[_curr].expose('ipc', ...args) },
  web: function(...args) { tracker[_curr].expose('web', ...args) }
})
