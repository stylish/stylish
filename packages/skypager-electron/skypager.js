module.exports = require('skypager').load(__filename, {
  manifest: require('./package.json'),
  paths:{
    settings:'data/settings'
  }
})
