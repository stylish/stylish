const path = require('path')
const fs = require('fs')
const Config = require('webpack-configurator')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const env = process.env.NODE_ENV || 'development'
const config = new Config()
const directory = process.cwd()
const isDev = (env === 'development')

const argv = require('yargs')

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

const entry = argv.entry || './src'

config
  .merge({
    entry: ['webpack-hot-middleware/client', 'skypager-themes/src/dashboard', entry],
    output: {
      path: path.join(directory, 'public'),
      filename: '[name].js',
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
    loader: isDev ? 'style!css?modules&localIdentName=[path]-[local]-[hash:base64:5]!postcss!less'
                    : ExtractTextPlugin.extract('style-loader', 'css-loader?modules&sourceMap!postcss-loader!less')

  })

  .plugin('webpack-define', webpack.DefinePlugin, [{
    'process.env': {
      NODE_ENV: JSON.stringify(env)
    },
    '__SOEDERPOP__': 'YESYESYALL'
  }])

  .plugin('webpack-order', webpack.optimize.OccurenceOrderPlugin)
  .plugin('webpack-noerrors', webpack.NoErrorsPlugin)

	.plugin('webpack-provide', webpack.ProvidePlugin, [{
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
	}])

  .plugin('webpack-html', HtmlWebpackPlugin, [{
    template: `${__dirname}/index.html`,
    hash: true,
    inject: 'body'
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
