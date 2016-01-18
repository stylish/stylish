var skypager = require('./packages/skypager/lib'),
    manifest = require('./package.json'),
    blueprint = require('./packages/skypager-plugin-blueprints'),
    project = skypager.load(__filename, {
      manifest: manifest,
      hooks: {
        registriesDidLoad: function() {
          var p = this
          blueprint(p)
          console.log('Applied blueprint plugin')
        }
      }
    });

module.exports = project
