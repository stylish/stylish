import { devpack as _devpack, availableProfiles, availablePresets } from './lib'

export const devpack = _devpack

export default devpack

export function project() {
  return require('./skypager')
}
