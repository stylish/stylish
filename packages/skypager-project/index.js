if (process.env.SKYPAGER_ENV === 'development') {
  require('babel-register')
  module.exports = require('./src')
} else {
  module.exports = require('./lib')
}
