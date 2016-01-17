var skypager = require('./packages/skypager/lib'),
    manifest = require('./package.json'),
    project = skypager.load(__filename, { manifest: manifest });

module.exports = project
