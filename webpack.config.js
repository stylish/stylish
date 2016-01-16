var path = require('path')

module.exports = {
  resolve: {
    fallback: [
      path.join(__dirname, 'packages'),
      path.join(__dirname, 'node_modules')
    ]
  }
}
