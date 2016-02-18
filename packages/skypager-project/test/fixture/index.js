module.exports = require('../index').load(__filename, {
  name: 'Skypager Core Documentation',
  autoLoad: {
    documents: true,
    data_sources: true,
    data: true,
    vectors: true
  },
  manifest: require(__dirname + '/package.json'),
  resolver:{
    modelPatterns: {
      testcase: /-spec/
    }
  },
  hooks: {
    registriesDidLoad: function() {
      this.registryHookRan = true
    }
  }
})
