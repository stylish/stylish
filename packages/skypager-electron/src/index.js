import { Application } from './application'

export function enter (options = {}) {
  return Application.boot(options)
}

