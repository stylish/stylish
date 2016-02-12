var bundle = module.exports = {};
bundle.project = require('./project-export.json');
bundle.entities = require('./entities-export.json');
bundle.assets = require('./assets-export.json');
bundle.models = require('./models-export.json');
bundle.settings = require('./settings-export.json');

    bundle.requireContexts = {
      scripts: require.context('/Users/jonathan/Skypager/projects/blueprint-io-webapp/src', true, /.js$/i),
      stylesheets: require.context('/Users/jonathan/Skypager/projects/blueprint-io-webapp/src', true, /..*ss$/i)
    };
    bundle.content = {}
var _assets = bundle.content.assets = {};
var _data_sources = bundle.content.data_sources = {};
var _documents = bundle.content.documents = {};
_documents['index'] = require('./docs/index.js');
_documents['pages/HomePage'] = require('./docs/pages/HomePage.js');
_documents['settings/branding'] = require('./docs/settings/branding.js');
_documents['settings/hosting'] = require('./docs/settings/hosting.js');
_documents['settings/hosting/amazon-web-services'] = require('./docs/settings/hosting/amazon-web-services.js');
_documents['settings/hosting/blueprint-io-platform'] = require('./docs/settings/hosting/blueprint-io-platform.js');
_documents['settings/hosting/surge'] = require('./docs/settings/hosting/surge.js');
var _images = bundle.content.images = {};
var _scripts = bundle.content.scripts = {};
_scripts['entries/HomePage'] = require('./src/entries/HomePage.js');
_scripts['entries/PackagesPage'] = require('./src/entries/PackagesPage.js');
_scripts['entries/ProjectsPage'] = require('./src/entries/ProjectsPage.js');
_scripts['index'] = require('./src/index.js');
_scripts['layouts/MainLayout'] = require('./src/layouts/MainLayout.js');
var _stylesheets = bundle.content.stylesheets = {};
_stylesheets['entries/HomePage'] = require('./src/entries/HomePage.js');
_stylesheets['entries/PackagesPage'] = require('./src/entries/PackagesPage.js');
_stylesheets['entries/ProjectsPage'] = require('./src/entries/ProjectsPage.js');
_stylesheets['index'] = require('./src/index.js');
_stylesheets['layouts/MainLayout'] = require('./src/layouts/MainLayout.js');
var _vectors = bundle.content.vectors = {};
var _packages = bundle.content.packages = {};
var _projects = bundle.content.projects = {};
var _settings = bundle.content.settings = {};
_settings['app'] = require('./settings/app.js');
_settings['branding'] = require('./settings/branding.js');
_settings['hosting'] = require('./settings/hosting.js');
_settings['integrations'] = require('./settings/integrations.js');
_settings['navigation'] = require('./settings/navigation.js');
module.exports = require('skypager/lib/bundle').create(bundle)