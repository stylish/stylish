
      require('skypager/lib/util').skypagerBabel()

      module.exports = require('skypager').load(__filename, {
        manifest: require('./package.json')
      })
      