'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (argv) {
  var md5 = require('md5');
  var path = require('path');
  var fs = require('fs');
  var exists = fs.existsSync;
  var resolve = path.resolve;
  var join = path.join;
  var assign = _assign2.default;
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

  var modulesDirectories = [directory + '/node_modules', path.resolve('../../node_modules'), path.join(__dirname, '../../src'), path.join(__dirname, '../..')];

  var platform = argv.platform || 'web';

  var entry = (0, _defineProperty3.default)({}, argv.entryName || 'app', [argv.entry || './src']);

  var precompiled = argv.precompiled || argv.usePrecompiledTemplate;

  if (env === 'development') {
    entry.app.unshift('webpack-hot-middleware/client');
  }

  if (!precompiled && !argv.skipTheme && argv.theme) {
    entry.theme = ['skypager-themes?theme=' + argv.theme + '&env=' + argv.env + '!' + directory + '/package.json'];
  }

  var outputPath = path.resolve(argv.outputFolder || join(directory, 'public'));

  var templatePath = __dirname + '/../../templates/index.html';

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

  var htmlFilename = argv.htmlFilename || 'index.html';

  if (env === 'production' && platform === 'web' && !argv.htmlFilename && argv.pushState) {
    htmlFilename = '200.html';
  }

  console.log('Modules Directories', modulesDirectories);
  config.merge({
    entry: entry,
    output: {
      path: outputPath,
      filename: argv.noContentHash || argv.contentHash === false || isDev ? '[name].js' : '[name]-[hash].js',
      publicPath: !isDev && platform === 'electron' ? '' : '/'
    },
    resolveLoader: {
      root: modulesDirectories.concat([path.dirname(require.resolve('skypager-themes'))])
    },
    resolve: {
      root: modulesDirectories.concat([directory, path.dirname(require.resolve('skypager-devpack'))]),
      modulesDirectories: ['src', 'dist', 'node_modules']
    },
    devtool: 'eval'
  }).loader('json', { loader: 'json', test: /.json$/ }).loader('js', {
    test: /\.jsx?$/,
    loader: 'babel',
    exclude: [path.join(process.env.PWD, 'dist', 'bundle'), /node_modules/],
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

  if ((argv.noVendorLibraries || argv.vendorLibraries !== false) && !argv.externalVendors && !precompiled) {
    config.merge({
      entry: {
        vendor: ['history', 'jquery', 'react', 'react-dom', 'react-redux', 'react-router', 'react-bootstrap', 'redux', 'redux-thunk', 'redux-actions', 'redux-simple-router'
        //'skypager-ui',
        //'skypager-application'
        ]
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
      externals: {
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
      }
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

  if (argv.exportLibrary) {
    config.merge({
      output: {
        library: argv.exportLibrary,
        libraryTarget: 'umd'
      }
    });
  }

  return config;
};