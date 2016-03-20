module.exports = function(skypager) {
  if (!skypager) {
    skypager = require('../../../skypager-project')
  }

  return skypager.load(__filename)
}
