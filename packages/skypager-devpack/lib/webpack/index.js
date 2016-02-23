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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultVendorStack = ['history', 'jquery', 'react', 'react-dom', 'react-redux', 'react-router', 'react-bootstrap', 'redux', 'redux-thunk', 'redux-actions', 'redux-simple-router'];

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
  'history': 'History'
};

module.exports = function (argv) {

  inspect(argv);

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

  var env = process.env.NODE_ENV || 'development';
  var config = new Config();
  var directory = process.cwd();

  var isDev = env === 'development';
  var fontsPrefix = argv.fontsPrefix || 'fonts';

  // this assumes the devpack is checked out and in skypager-central/packages/skypager-devpack
  var babelModulesPath = argv.modulesPath || process.env.SKYPAGER_MODULES_PATH || '../../../node_modules';

  var themesModuleRoot = path.dirname(require.resolve('skypager-themes'));
  var devpackModuleRoot = path.join(__dirname, '../..');

  var modulesDirectories = [directory, join(directory, 'src'), devpackModuleRoot, join(devpackModuleRoot, 'src'), themesModuleRoot, join(directory, 'node_modules'), join(devpackModuleRoot, 'node_modules')];

  var platform = argv.platform || 'web';
  var precompiled = argv.precompiled || argv.usePrecompiledTemplate;

  var entry = {};

  if (argv.entryPoints && argv.devpack_api === 'v2') {
    entry = assign(entry, argv.entryPoints);
  } else {
    entry = assign(entry, (0, _defineProperty3.default)({}, argv.entryName || 'app', [argv.entry || './src']));
  }

  entry = (0, _mapValues2.default)(entry, function (v, k) {
    return typeof v === 'string' ? [v] : v;
  });

  if (isDev) {
    entry = (0, _mapValues2.default)(entry, function (v, k) {
      v.unshift('webpack-hot-middleware/client');
      return v;
    });
  }

  var outputPath = argv.outputFolder ? path.resolve(argv.outputFolder) : join(directory, 'public');

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

  if (argv.htmlTemplatePath) {
    templatePath = path.resolve(argv.htmlTemplatePath);
  }

  var htmlFilename = argv.htmlFilename || argv.outputFile || 'index.html';

  if (env === 'production' && platform === 'web' && !argv.htmlFilename && argv.pushState) {
    htmlFilename = '200.html';
  }

  config.merge({
    entry: entry,
    output: {
      path: outputPath,
      filename: argv.noContentHash || argv.contentHash === false || isDev ? '[name].js' : '[name]-[hash].js',
      publicPath: !isDev && platform === 'electron' ? '' : '/',
      contentBase: argv.contentBase || join(directory, 'src')
    },
    resolveLoader: {
      root: modulesDirectories
    },
    resolve: {
      root: modulesDirectories,
      fallback: argv.moduleFallback || devpackModuleRoot,
      modulesDirectories: ['src', 'src/ui', 'dist', 'node_modules']
    },
    devtool: 'eval'
  }).loader('json', { loader: 'json', test: /.json$/ }).loader('js', {
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
  }).loader('less', {
    test: /\.less$/,
    include: [join(directory, 'src'), join(devpackModuleRoot, 'src', 'ui')],
    exclude: [excludeNodeModulesExceptSkypagers, themesModuleRoot],
    loader: isDev ? 'style!css?modules&localIdentName=[path]-[local]-[hash:base64:5]!postcss!less' : ExtractTextPlugin.extract('style-loader', 'css-loader?modules&sourceMap!postcss-loader!less')

  }).loader('url-1', { test: /\.woff(\?.*)?$/, loader: 'url?prefix=' + fontsPrefix + '/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' }).loader('url-2', { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=' + fontsPrefix + '/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' }).loader('url-3', { test: /\.ttf(\?.*)?$/, loader: 'url?prefix=' + fontsPrefix + '/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' }).loader('file', { test: /\.eot(\?.*)?$/, loader: 'file?prefix=' + fontsPrefix + '/&name=[path][name].[ext]' }).loader('url-4', { test: /\.svg(\?.*)?$/, loader: 'url?prefix=' + fontsPrefix + '/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' }).loader('url-5', { test: /\.(png|jpg)$/, loader: 'url?limit=8192' }).loader('ejs', { test: /\.ejs/, loader: 'ejs' }).plugin('webpack-order', webpack.optimize.OccurenceOrderPlugin).plugin('webpack-noerrors', webpack.NoErrorsPlugin);

  var featureFlags = {
    '__PLATFORM__': (0, _stringify2.default)(platform),
    'process.env': {
      NODE_ENV: (0, _stringify2.default)(env)
    }
  };

  if (argv.featureFlags) {
    if (exists(resolve(argv.featureFlags))) {
      try {
        var extras = require(argv.featureFlags);
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

  var staticAssets = argv.staticAssets || {};

  var bodyScripts = staticAssets.bodyScripts || [];
  var staticStyles = staticAssets.staticStyles || [];
  var headerScripts = staticAssets.headerScripts || [];
  var googleFont = staticAssets.googleFont || 'http://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic';

  if (!argv.entryOnly && !argv.exportLibrary) {
    config.plugin('webpack-html', HtmlWebpackPlugin, [{
      template: '' + templatePath,
      hash: false,
      inject: argv.templateInject === 'none' ? false : argv.templateInject || 'body',
      filename: htmlFilename,
      bodyScripts: bodyScripts,
      headerScripts: headerScripts,
      staticStyles: [googleFont].concat(staticStyles)
    }]);
  }

  // development
  if (isDev) {
    config.plugin('webpack-hmr', webpack.HotModuleReplacementPlugin);
  }

  if ((argv.noVendorLibraries || argv.vendorLibraries === false) && !argv.externalVendors && !precompiled) {
    config.merge({
      entry: {
        vendor: buildVendorStack(argv)
      }
    });

    config.plugin('common-chunks', webpack.optimize.CommonsChunkPlugin, [{ names: ['vendor'] }]);
  }

  if (argv.target) {
    config.merge({
      target: argv.target
    });
  }
  if (argv.externalVendors || precompiled) {
    config.merge({
      externals: buildExternals(argv)
    });
  }

  // production
  if (!isDev) {
    config.merge({ devtool: 'cheap-module-source-map' });

    var extractFilename = platform === 'electron' || argv.noContentHash || argv.contentHash === false ? '[name].js' : '[name]-[hash].js';

    config.plugin('extract-text', ExtractTextPlugin, [extractFilename, {
      allChunks: true
    }]);

    /*.plugin('webpack-uglify', webpack.optimize.UglifyJsPlugin, [{
      compressor: { warnings: false },
      compress: {
        unused: true,
        dead_code: true
      }
    }])*/
  }

  config.merge({
    resolve: {
      alias: {
        'dist': argv.distPath && resolve(argv.distPath) || path.join(directory, 'dist')
      }
    }
  });

  config.merge({
    recordsPath: join(directory, 'tmp', 'records')
  });

  if (argv.exportLibrary) {
    config.merge({
      output: {
        library: argv.exportLibrary,
        libraryTarget: 'umd'
      }
    });
  }

  console.log('Final Config');
  console.log(inspect(config.resolve()));
  return config;
};

function excludeNodeModulesExceptSkypagers(absolutePath) {
  if (absolutePath.match(/node_modules/)) {
    if (absolutePath.match(/skypager/) && absolutePath.match(/src/)) {
      return false;
    }

    return true;
  }

  return false;
}

function buildVendorStack(argv) {
  if (argv.vendor && (0, _typeof3.default)(argv.vendor) === 'object') {
    return argv.vendor;
  }

  return DefaultVendorStack;
}

function buildExternals(argv) {
  if (argv.externalVendors && (0, _typeof3.default)(argv.externalVendors) === 'object') {
    return argv.externalVendors;
  }

  return ExternalVendorMappings;
}

function inspect(obj) {
  console.log((0, _stringify2.default)((0, _omit2.default)(obj, 'commands', 'options', '_execs', '_allowUnknownOption', '_args', '_name', '_noHelp', 'parent', '_alias', '_description', '_events', '_eventsCount'), null, 2));
}