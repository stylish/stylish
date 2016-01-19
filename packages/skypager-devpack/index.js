const argv = require('yargs').argv
const path = require('path')
const fs = require('fs')
const Config = require('webpack-configurator')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const env = process.env.NODE_ENV || 'development'
const config = new Config()
const directory = process.cwd()
const isDev = (!argv.production && env === 'development')
const fontsPrefix = 'fonts'

const myPackage = require(directory + '/package.json')

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

const entry = {
  app: [ argv.entry || './src' ],
  theme: `skypager-themes!${directory}/package.json`,
  vendor: [
    'history',
    'jquery',
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'react-bootstrap',
    'redux',
    'redux-thunk',
    'redux-actions',
    'redux-simple-router'
  ]
}

if (isDev) { entry.app.unshift('webpack-hot-middleware/client') }

const platform = argv.platform || 'web'

config
  .merge({
    entry: entry,
    output: {
      path: path.join(directory, 'public'),
      filename: (isDev ? '[name].js' : '[name]-[hash].js'),
      publicPath: ''
    },
    resolveLoader: {
      modulesDirectories: modulesDirectories.concat([ require.resolve('skypager-themes') ])
    },
    resolve: {
      modulesDirectories
    },
    devtool: 'eval'
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
    loader: isDev ? 'style!css?modules&localIdentName=[path]-[local]-[hash:base64:5]!postcss!less'
                    : ExtractTextPlugin.extract('style-loader', 'css-loader?modules&sourceMap!postcss-loader!less')

  })

  .loader('url-1', { test: /\.woff(\?.*)?$/,  loader: 'url?prefix=' + fontsPrefix + '/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' })
  .loader('url-2', { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=' + fontsPrefix + '/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' })
  .loader('url-3', { test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=' + fontsPrefix + '/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' })
  .loader('file', { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=' + fontsPrefix + '/&name=[path][name].[ext]' })
  .loader('url-4', { test: /\.svg(\?.*)?$/,   loader: 'url?prefix=' + fontsPrefix + '/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' })
  .loader('url-5', { test: /\.(png|jpg)$/,    loader: 'url?limit=8192' })


  .plugin('webpack-define', webpack.DefinePlugin, [{
    'process.env': {
      NODE_ENV: JSON.stringify(env)
    }
  }])

  .plugin('webpack-order', webpack.optimize.OccurenceOrderPlugin)
  .plugin('webpack-noerrors', webpack.NoErrorsPlugin)

  .plugin('common-chunks', webpack.optimize.CommonsChunkPlugin, [{ names: ['vendor'] }])

  .plugin('webpack-html', HtmlWebpackPlugin, [{
    template: `${__dirname}/index.html`,
    hash: true,
    inject: 'body',
    filename: argv.outputFile || 'index.html'
  }])

// development
if (env == 'development') {
  config.plugin('webpack-hmr', webpack.HotModuleReplacementPlugin)
}

// production
if (env == 'production') {
  config
    .merge({devtool: 'source-map'})

    .plugin('extract-text', ExtractTextPlugin, ['[name].[contenthash].css',{
      allChunks: true
    }])

    .plugin('webpack-uglify', webpack.optimize.UglifyJsPlugin, [{
      compress: {
        unused: true,
        dead_code: true
      },
      compressor: { warnings: false }
    }])
}

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
