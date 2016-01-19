const path = require('path')
const fs = require('fs')
const Config = require('webpack-configurator')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const argv = require('yargs')

const env = process.env.NODE_ENV || 'development'
const config = new Config()
const directory = process.cwd()
const isDev = true
const fontsPrefix = 'fonts'

const modulesDirectories = [
  `${directory}/node_modules`,
  `${__dirname}/node_modules`,
  'node_modules'
]

const hasModules = fs.existsSync(path.join(__dirname, 'node_modules'))

const resolveBabelPackages = packages => {
  const modulePath = hasModules ? 'node_modules' : '../../node_modules'
  return packages.map(p => { return path.resolve(__dirname, modulePath, p) })
}

const provideModules = {
  '$': 'jquery',
  'jquery': 'jquery',
  'react': 'react',
  'react-dom': 'react-dom',
  'react-redux': 'react-redux',
  'react-router': 'react-router',
  'redux-simple-router': 'redux-simple-router',
  'redux-thunk': 'redux-thunk',
  'react-bootstrap': 'react-bootstrap',
  'history': 'history/lib/createBrowserHistory',
  'redux-actions': 'redux-actions'
}

const entry = [
  argv.entry || './src'
]

const myPackage = require(directory + '/package.json')

if (isDev) { entry.unshift('webpack-hot-middleware/client') }

config
  .merge({
    entry: entry,
    output: {
      path: path.join(directory, 'public'),
      filename: '[name]-[hash].js',
      publicPath: '/'
    },
    resolveLoader: {modulesDirectories},
    resolve: {
      modulesDirectories
    },
    devtool: 'eval',
    // devtool: 'cheap-module-eval-source-map'
  })

  .loader('js', {
    test: /\.jsx?$/,
    loader: 'babel',
    exclude: /(node_modules|bower_components)/,
    query: {
      presets: resolveBabelPackages(['babel-preset-react', 'babel-preset-es2015', 'babel-preset-stage-0']),
      plugins: resolveBabelPackages(['babel-plugin-transform-decorators-legacy']),
      env: {
        development: {
          presets: resolveBabelPackages(['babel-preset-react-hmre'])
        }
      }
    }
  })

  .loader('less', {
    test: /\.less$/,
    loader: isDev ? 'style!less' : ExtractTextPlugin.extract('style-loader', 'less-loader')
  })

  .loader('url1', { test: /\.woff(\?.*)?$/,  loader: 'url?prefix=' + fontsPrefix + '/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' })
  .loader('url2', { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=' + fontsPrefix + '/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' })
  .loader('url3', { test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=' + fontsPrefix + '/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' })
  .loader('file', { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=' + fontsPrefix + '/&name=[path][name].[ext]' })
  .loader('url5', { test: /\.svg(\?.*)?$/,   loader: 'url?prefix=' + fontsPrefix + '/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' })
  .loader('url6', { test: /\.(png|jpg)$/,    loader: 'url?limit=8192' })

  .plugin('webpack-define', webpack.DefinePlugin, [{
    'process.env': {
      NODE_ENV: JSON.stringify(env)
    },
    '__SOEDERPOP__': 'YESYESYALL'
  }])

  .plugin('webpack-order', webpack.optimize.OccurenceOrderPlugin)
  .plugin('webpack-noerrors', webpack.NoErrorsPlugin)

  .plugin('webpack-provide', webpack.ProvidePlugin, [ provideModules ])

  .plugin('webpack-html', HtmlWebpackPlugin, [{
    template: `${__dirname}/index.html`,
    hash: true,
    inject: 'body',
    filename: '200.html'
  }])

// development
if (env == 'development') {
  config.plugin('webpack-hmr', webpack.HotModuleReplacementPlugin)
}

// production
if (env == 'production') {
  config
    .merge({devtool: 'source-map'})
    .plugin('webpack-uglify', webpack.optimize.UglifyJsPlugin, [{
      compressor: { warnings: false }
    }])
}

// merge in user-configs
// accepts {} or function(config)
const userConfig = path.resolve(directory, './webpack.config.js')
if (fs.existsSync(userConfig)) {
  config.merge(require(userConfig))
}

if (argv.project) {
  config.merge({
    resolve: {
      alias: {
        'skypager-project-src': path.resolve(argv.project)
      }
    }
  })
}

if (argv.projectSnapshot) {
  config.merge({
    resolve: {
      alias: {
        'skypager-project-dist': path.resolve(argv.projectSnapshot)
      }
    }
  })
}

module.exports = config
