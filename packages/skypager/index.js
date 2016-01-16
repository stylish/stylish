if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/index')
} else {
  require('babel-register')
  module.exports = require('./src/index')
}
