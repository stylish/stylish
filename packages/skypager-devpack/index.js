if (process.env.SKYPAGER_ENV === 'development') {
  require('babel-register')
  module.exports = require('./src/cli')
} else {
  module.exports = require('./lib/cli')
}
