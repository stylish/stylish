if (process.env.SKYPAGER_ENV === 'development') {
  module.exports = require('./src')
} else {
  module.exports = require('./lib')
}
