'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign2 = require('babel-runtime/core-js/object/assign');

var _assign3 = _interopRequireDefault(_assign2);

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _defaults = require('lodash/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * THIS SCRIPT IS A MESS.
 *
 * I need to break this down into separate chunks and document the options
 *
 */

var DefaultVendorStack = ['history', 'jquery', 'react', 'react-dom', 'react-redux', 'react-router', 'react-bootstrap', 'redux', 'redux-thunk', 'redux-actions', 'redux-simple-router', 'radium'];

var ExternalVendorMappings = {
  'jquery': 'jQuery',
  'react': 'React',
  'react-dom': 'ReactDOM',
  'react-bootstrap': 'ReactBootstrap',
  'redux': 'Redux',
  'react-router': 'Router',
  'redux-actions': 'ReduxActions',
  'redux-thunk': 'ReduxThunk',
  'redux-simple-router': 'ReduxSimpleRouter',
  'history': 'History',
  'radium': 'Radium'
};

module.exports = function () {
  var externalOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var options = (0, _defaults2.default)((0, _omit2.default)(require('yargs').argv, '_', '$'), externalOptions);

  inspect('Options', options, options.debug);

  var md5 = require('md5');
  var path = require('path');
  var fs = require('fs');
  var exists = fs.existsSync;
  var resolve = path.resolve;
  var join = path.join;
  var assign = _assign3.default;
  var Config = require('webpack-configurator');
  var webpack = require('webpack');
  var HtmlWebpackPlugin = require('html-webpack-plugin');
  var ExtractTextPlugin = require('extract-text-webpack-plugin');

  var env = options.env || options.environment || process.env.NODE_ENV || 'development';
  var config = new Config();
  var directory = options.root || process.cwd();

  var isDev = env === 'development';
  var fontsPrefix = options.fontsPrefix || 'fonts';

  var themesModuleRoot = path.dirname(require.resolve('skypager-themes'));
  var devpackModuleRoot = path.join(__dirname, '../..');

  var modulesDirectories = [directory, join(directory, 'src'), devpackModuleRoot, join(devpackModuleRoot, 'src'), themesModuleRoot, join(directory, 'node_modules'), join(devpackModuleRoot, 'node_modules')];

  var platform = options.platform || 'web';
  var precompiled = options.precompiled || options.usePrecompiledTemplate;

  var projectThemePath = options.projectThemePath || join(themesModuleRoot, 'packages/default');
  var entry = {};

  if (options.entryPoints && options.devpack_api === 'v2') {
    entry = assign(entry, options.entryPoints);
  } else {
    entry = assign(entry, (0, _defineProperty3.default)({}, options.entryName || 'app', [options.entry || './src']));
  }

  entry = (0, _mapValues2.default)(entry, function (v, k) {
    return typeof v === 'string' ? [v] : v;
  });

  if (!entry.theme && options.theme) {
    entry.theme = [options.theme.match(/\//) ? options.theme : 'themes/' + options.theme];
  }

  if (exists(join(directory, 'src/theme'))) {
    projectThemePath = join(directory, 'src/theme');

    if (!exists(join(projectThemePath, 'variables.less'))) {
      console.log('Automatically generating a ' + 'variables.less'.green + ' file in ' + 'src/theme'.yellow);
      console.log('This file will let you override theme variables more easily');

      require('fs').writeFileSync(join(projectThemePath, 'variables.less'), '// Prepackaged skypager-themes automatically @import this file.  You can override any of their variables here.', 'utf8');
    }
  }

  if (isDev) {
    entry = (0, _mapValues2.default)(entry, function (v, k) {
      v.unshift('webpack-hot-middleware/client');
      return v;
    });
  }

  if (!options.noVendor) {
    entry.vendor = buildVendorStack(options);

    config.plugin('common-chunks', webpack.optimize.CommonsChunkPlugin, [{ names: ['vendor'] }]);
  }

  var outputPath = options.outputFolder ? path.resolve(options.outputFolder) : join(directory, 'public');

  var templatePath = join(devpackModuleRoot, 'templates', 'index.html');

  if (precompiled) {
    try {
      if (exists(resolve(precompiled))) {
        templatePath = resolve(precompiled);
      }
    } catch (error) {
      console.log('Error precompiled path', error.message);
      throw error;
    }
  }

  if (options.htmlTemplatePath) {
    templatePath = path.resolve(options.htmlTemplatePath);
  }

  var htmlFilename = options.htmlFilename || options.outputFile || 'index.html';

  if (env === 'production' && platform === 'web' && !options.htmlFilename && options.pushState) {
    htmlFilename = '200.html';
  }

  config.merge({
    entry: entry,
    output: {
      path: outputPath,
      filename: options.noContentHash || options.contentHash === false || isDev ? '[name].js' : '[name]-[hash].js',
      publicPath: !isDev && platform === 'electron' ? '' : '/',
      contentBase: options.contentBase || join(directory, 'src')
    },
    resolveLoader: {
      root: modulesDirectories
    },
    resolve: {
      root: modulesDirectories,
      fallback: options.moduleFallback || devpackModuleRoot,
      modulesDirectories: ['src', 'src/ui', 'dist', 'node_modules']
    },
    devtool: 'eval'
  });

  config.loader('json', { loader: 'json', test: /.json$/ });

  config.loader('js', {
    test: /\.jsx?$/,
    loader: 'babel',
    exclude: [path.join(process.env.PWD, 'dist', 'bundle'), excludeNodeModulesExceptSkypagers],
    query: {
      presets: [require.resolve('babel-preset-skypager')],
      env: {
        development: {
          presets: [require.resolve('babel-preset-react-hmre')]
        }
      }
    }
  });

  config.loader('less-2', {
    test: /.*\.less$/,
    include: [themesModuleRoot, projectThemePath],
    exclude: [excludeNodeModulesExceptSkypagers],
    loader: isDev ? 'style-loader!css-loader!less-loader' : ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!less')

  }).loader('less', {
    test: /\.less$/,
    include: [join(directory, 'src'), join(devpackModuleRoot, 'src', 'ui')],
    exclude: [excludeNodeModulesExceptSkypagers, themesModuleRoot, projectThemePath],
    loader: isDev ? 'style!css?modules&localIdentName=[path]-[local]-[hash:base64:5]!postcss!less' : ExtractTextPlugin.extract('style-loader', 'css-loader?modules&sourceMap!postcss-loader!less')

  }).loader('url-1', { test: /\.woff(\?.*)?$/, loader: 'url?prefix=' + fontsPrefix + '/&name=[name].[ext]&limit=10000&mimetype=application/font-woff' }).loader('url-2', { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=' + fontsPrefix + '/&name=[name].[ext]&limit=10000&mimetype=application/font-woff2' }).loader('url-3', { test: /\.ttf(\?.*)?$/, loader: 'url?prefix=' + fontsPrefix + '/&name=[name].[ext]&limit=10000&mimetype=application/octet-stream' }).loader('file', { test: /\.eot(\?.*)?$/, loader: 'file?prefix=' + fontsPrefix + '/&name=[name].[ext]' }).loader('url-4', { test: /\.svg(\?.*)?$/, loader: 'url?prefix=' + fontsPrefix + '/&name=[name].[ext]&limit=10000&mimetype=image/svg+xml' }).loader('url-5', { test: /\.(png|jpg)$/, loader: 'url?limit=8192' }).loader('ejs', { test: /\.ejs/, loader: 'ejs' });

  config.plugin('webpack-order', webpack.optimize.OccurenceOrderPlugin).plugin('webpack-dedupe', webpack.optimize.DedupePlugin);

  var featureFlags = {
    '__PLATFORM__': (0, _stringify2.default)(platform),
    '__SKYPAGER_THEME_CONFIG__': (0, _stringify2.default)(options.themeConfigPath || join(directory, 'package.json')),
    'process.env': {
      NODE_ENV: (0, _stringify2.default)(env)
    }
  };

  if (options.featureFlags) {
    if (exists(resolve(options.featureFlags))) {
      try {
        var extras = require(options.featureFlags);
        if ((typeof extras === 'undefined' ? 'undefined' : (0, _typeof3.default)(extras)) === 'object') {
          featureFlags = (0, _keys2.default)(extras).reduce(function (memo, key) {
            memo['__' + key.toUpperCase() + '__'] = (0, _stringify2.default)(extras[key]);
            return memo;
          }, featureFlags);
        }
      } catch (error) {
        console.log('Error setting feature flags', error.message);
      }
    }
  }

  config.plugin('webpack-define', webpack.DefinePlugin, [featureFlags]);

  var staticAssets = options.staticAssets || {};

  var bodyScripts = staticAssets.bodyScripts || [];
  var staticStyles = staticAssets.staticStyles || [];
  var headerScripts = staticAssets.headerScripts || [];
  var googleFont = staticAssets.googleFont || 'http://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic';

  if (!options.entryOnly && !options.exportLibrary) {
    config.plugin('webpack-html', HtmlWebpackPlugin, [{
      template: '' + templatePath,
      hash: false,
      inject: options.templateInject === 'none' ? false : options.templateInject || 'body',
      filename: htmlFilename,
      bodyScripts: bodyScripts,
      headerScripts: headerScripts,
      staticStyles: [googleFont].concat(staticStyles)
    }]);
  }

  // development
  if (isDev) {
    config.plugin('webpack-hmr', webpack.HotModuleReplacementPlugin).plugin('webpack-noerrors', webpack.NoErrorsPlugin);
  }

  if (options.target) {
    config.merge({
      target: options.target
    });
  }

  if (options.externalVendors || precompiled) {
    config.merge({
      externals: buildExternals(options)
    });
  }

  if (!isDev) {
    config.merge({ devtool: 'cheap-module-source-map' });

    var extractFilename = platform === 'electron' || options.noContentHash || options.contentHash === false ? '[name].css' : '[name]-[contenthash].css';

    config.plugin('extract-text', ExtractTextPlugin, [extractFilename, {
      allChunks: true
    }]).plugin('webpack-uglify', webpack.optimize.UglifyJsPlugin, [{
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    }]);
  }

  config.merge({
    resolve: {
      alias: {
        'dist': options.distPath && resolve(options.distPath) || path.join(directory, 'dist'),
        'project-theme': projectThemePath
      }
    }
  });

  config.merge({
    recordsPath: join(directory, 'tmp', 'records')
  });

  if (options.exportLibrary) {
    config.merge({
      output: {
        library: options.exportLibrary,
        libraryTarget: 'umd'
      }
    });
  }

  inspect('Application Entry Points', entry, options.debug);

  return config;
};

function excludeNodeModulesExceptSkypagers(absolutePath) {
  if (absolutePath.match(/node_modules/)) {
    if (absolutePath.match(/skypager/) && absolutePath.match(/src/)) {
      return false;
    }

    if (absolutePath.match(/skypager-themes/)) {
      return false;
    }

    return true;
  }

  return false;
}

function buildVendorStack(options) {
  if (options.vendor && (0, _typeof3.default)(options.vendor) === 'object') {
    return (0, _keys2.default)(options.vendor);
  }

  return DefaultVendorStack;
}

function buildExternals(options) {
  if (options.vendor && (0, _typeof3.default)(options.vendor) === 'object') {
    return (0, _keys2.default)(options.vendor);
  }

  return ExternalVendorMappings;
}

function inspect(note, obj) {
  var debuggingEnabled = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  if (!debuggingEnabled) {
    return;
  }
  console.log("");
  console.log(note);
  console.log('------');

  console.log((0, _util.colorize)((0, _omit2.default)(obj, 'commands', 'options', '_execs', '_allowUnknownOption', '_args', '_name', '_noHelp', 'parent', '_alias', '_description', '_events', '_eventsCount')));

  console.log("\n\n\n");
}