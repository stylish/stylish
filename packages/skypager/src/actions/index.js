import Action from '../helpers/action'

const actions = ['assets/load','assets/update','documents/create','documents/detect_entities','projects/publish','trees/document']

module.exports = function loadActions (skypager) {
  actions.forEach(action => {
    registry.load(require.resolve('./' + action))
  })
}
