/**
 * THIS SCRIPT IS A MESS.
 *
 * I need to break this down into separate chunks and document the options
 *
 */
import mapValues from 'lodash/mapValues'
import omit from 'lodash/omit'
import defaults from 'lodash/defaults'
import { colorize } from '../util'

const DefaultVendorStack = [
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
  'redux-simple-router',
  'radium',
  'tcomb-react',
  'tcomb-form'
]

const ExternalVendorMappings = {
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
  'radium': 'Radium',
  'tcomb-form': 'TcombForm',
  'tcomb-react': 'TcombReact'
}

module.exports = function (externalOptions = {}) {

  let options = defaults(
    omit(require('yargs').argv, '_', '$'),
    externalOptions
  )

  inspect('Options', options, options.debug)

	const md5 = require('md5')
  const path = require('path')
  const fs = require('fs')
	const exists = fs.existsSync
	const resolve = path.resolve
	const join = path.join
  const assign = Object.assign
  const Config = require('webpack-configurator')
  const webpack = require('webpack')
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  const ExtractTextPlugin = require('extract-text-webpack-plugin')

  const env = options.env || options.environment || process.env.NODE_ENV || 'development'
  const config = new Config()
  const directory = options.root || process.cwd()

	const isDev = (env === 'development')
  const fontsPrefix = options.fontsPrefix || 'fonts'

  const themesModuleRoot = path.dirname(
    require.resolve('skypager-themes')
  )

  const uiModuleRoot = path.dirname(
    require.resolve('skypager-ui')
  )

  const devpackModuleRoot = path.join(__dirname, '../..')

  const modulesDirectories = [
    directory,
    join(directory,'src'),
    devpackModuleRoot,
    join(uiModuleRoot, 'src'),
    themesModuleRoot,
    join(directory, 'node_modules'),
    join(uiModuleRoot, 'node_modules'),
    join(themesModuleRoot, 'node_modules'),
    join(devpackModuleRoot, 'node_modules'),
  ]

  const platform = options.platform || 'web'
  const precompiled = options.precompiled || options.usePrecompiledTemplate

  let projectThemePath = options.projectThemePath || join(themesModuleRoot, 'packages/default')
  let entry = {}

  if (options.entryPoints && options.devpack_api === 'v2') {
    entry = assign(entry, options.entryPoints)
  } else {
    entry = assign(entry, {
      [options.entryName || 'app']: [ options.entry || './src' ],
    })
  }

  entry = mapValues(entry, (v,k) => typeof v === 'string' ? [v] : v)

  if (!entry.theme && options.theme) {
    entry.theme = [
      options.theme.match(/\//) ? options.theme : `ui/themes/${ options.theme }`
    ]
  }

  if (exists(join(directory,'src/theme'))) {
    projectThemePath = join(directory,'src/theme')

    if (!exists(join(projectThemePath,'variables.less'))) {
      console.log('Automatically generating a ' + 'variables.less'.green + ' file in ' + 'src/theme'.yellow)
      console.log('This file will let you override theme variables more easily')

      require('fs').writeFileSync(
        join(projectThemePath,'variables.less'),
        '// Prepackaged skypager-themes automatically @import this file.  You can override any of their variables here.',
        'utf8'
      )
    }
  }

  if (isDev) {
    entry = mapValues(entry, (v,k) => {
       v.unshift('webpack-hot-middleware/client')
       return v
    })
  }

  if (!options.noVendor) {
    entry.vendor = buildVendorStack(options)

    config
      .plugin('common-chunks', webpack.optimize.CommonsChunkPlugin, [{ names: ['vendor'] }])
  }


	var outputPath = options.outputFolder ? path.resolve(options.outputFolder)  : join(directory, 'public')

  var templatePath = join(devpackModuleRoot, 'templates', 'index.html')

  if (precompiled) {
    try {
      if (exists(resolve(precompiled))) {
        templatePath = resolve(precompiled)
      }
    } catch(error) {
       console.log('Error precompiled path', error.message)
       throw(error)
    }
  }

  if (options.htmlTemplatePath) {
    templatePath = path.resolve(options.htmlTemplatePath)
  }

  var htmlFilename = options.htmlFilename || options.outputFile || 'index.html'

  if (env === 'production' && platform === 'web' && !options.htmlFilename && options.pushState) {
    htmlFilename = '200.html'
  }

  config
    .merge({
      entry: entry,
      output: {
        path: outputPath,
        filename: (options.noContentHash || options.contentHash === false || isDev ? '[name].js' : '[name]-[hash].js'),
        publicPath: (!isDev && platform === 'electron') ? '' : '/',
        contentBase: options.contentBase || join(directory, 'src')
      },
      resolveLoader: {
        root: modulesDirectories
      },
      resolve: {
				root: modulesDirectories,
        fallback: options.moduleFallback || devpackModuleRoot,
				modulesDirectories:[
					'src',
          'src/ui',
          'dist',
          'node_modules'
				]
      },
      devtool: 'eval'
    })

  config
		.loader('json', {loader: 'json', test:/.json$/})

  config
    .loader('js', {
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: [
        path.join(process.env.PWD, 'dist', 'bundle'),
        excludeNodeModulesExceptSkypagers
      ],
      query: {
        presets: [require.resolve('babel-preset-skypager')],
        env: {
          development: {
            presets: [require.resolve('babel-preset-react-hmre')]
          }
        }
      }
    })

  config
    .loader('less-2', {
      test: /.*\.less$/,
      include:[
        themesModuleRoot,
        projectThemePath
      ],
      exclude:[
        excludeNodeModulesExceptSkypagers
      ],
      loader: isDev ? 'style-loader!css-loader!less-loader'
                      : ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!less')

    })

    .loader('css', {
      test: /\.css$/,
      loader: 'style!css!postcss'
    })

    .loader('css-2', {
      test: /\.mod\.css$/,
      loader: 'style!css?modules!postcss'
    })

    .loader('less', {
      test: /\.less$/,
      include:[
        join(directory, 'src'),
        join(uiModuleRoot, 'src')
      ],
      exclude:[
        excludeNodeModulesExceptSkypagers,
        themesModuleRoot,
        projectThemePath
      ],
      loader: isDev ? 'style!css?modules&localIdentName=[path]-[local]-[hash:base64:5]!postcss!less'
                     : ExtractTextPlugin.extract('style-loader', 'css-loader?modules&sourceMap!postcss-loader!less')

    })

    .loader('url-1', { test: /\.woff(\?.*)?$/,  loader: 'url?prefix=' + fontsPrefix + '/&name=[name].[ext]&limit=10000&mimetype=application/font-woff' })
    .loader('url-2', { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=' + fontsPrefix + '/&name=[name].[ext]&limit=10000&mimetype=application/font-woff2' })
    .loader('url-3', { test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=' + fontsPrefix + '/&name=[name].[ext]&limit=10000&mimetype=application/octet-stream' })
    .loader('file', { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=' + fontsPrefix + '/&name=[name].[ext]' })
    .loader('url-4', { test: /\.svg(\?.*)?$/,   loader: 'url?prefix=' + fontsPrefix + '/&name=[name].[ext]&limit=10000&mimetype=image/svg+xml' })
    .loader('url-5', { test: /\.(png|jpg)$/,    loader: 'url?limit=8192' })
		.loader('ejs', {test:/\.ejs/, loader: 'ejs'})

  config
    .plugin('webpack-order', webpack.optimize.OccurenceOrderPlugin)
    .plugin('webpack-dedupe', webpack.optimize.DedupePlugin)


	let featureFlags = {
		'__PLATFORM__': JSON.stringify(platform),
    '__SKYPAGER_THEME_CONFIG__': JSON.stringify(
      options.themeConfigPath || join(directory, 'package.json')
    ),
		'process.env': {
			NODE_ENV: JSON.stringify(env)
		}
	}

	if (options.featureFlags) {
		if (exists(resolve(options.featureFlags))) {
			try {
				var extras = require(options.featureFlags)
				if (typeof extras === 'object') {
					featureFlags = Object.keys(extras).reduce((memo,key)=>{
						memo[`__${ key.toUpperCase() }__`] = JSON.stringify(extras[key])
						return memo
					}, featureFlags)
				}
			} catch (error) {
				console.log('Error setting feature flags', error.message)
			}
		}
	}

	config.plugin('webpack-define', webpack.DefinePlugin, [featureFlags])

	let staticAssets = options.staticAssets || {}

	let bodyScripts = staticAssets.bodyScripts || []
	let staticStyles = staticAssets.staticStyles || []
	let headerScripts = staticAssets.headerScripts || []
	let googleFont = staticAssets.googleFont || `http://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic`

	if (!options.entryOnly && !options.exportLibrary) {
		config.plugin('webpack-html', HtmlWebpackPlugin, [{
			template: `${ templatePath }`,
			hash: false,
			inject: options.templateInject === 'none' ? false : (options.templateInject || 'body'),
			filename: htmlFilename,
			bodyScripts,
			headerScripts,
			staticStyles: [googleFont].concat(staticStyles),
		}])
	}

  // development
  if (isDev) {
    config
      .plugin('webpack-hmr', webpack.HotModuleReplacementPlugin)
      .plugin('webpack-noerrors', webpack.NoErrorsPlugin)
  }

	if (options.target) {
		config.merge({
			target: options.target
		})
	}

  if (options.externalVendors || precompiled ) {
    config.merge({
      externals: buildExternals(options)
    })
  }

  if (!isDev) {
  	config .merge({ devtool: 'cheap-module-source-map' })

		let extractFilename = (platform === 'electron' || options.noContentHash || options.contentHash === false)
      ? '[name].css'
      : '[name]-[contenthash].css'

		config
      .plugin('extract-text', ExtractTextPlugin, [extractFilename, {
        allChunks: true
      }])

      .plugin('webpack-uglify', webpack.optimize.UglifyJsPlugin, [{
        compress:{
          unused: true,
          dead_code: true,
          warnings: false
        }
      }])
  }

  config.merge({
    resolve:{
      alias: {
        'dist': (options.distPath && resolve(options.distPath)) || path.join(directory, 'dist'),
        'project-theme': projectThemePath,
        'ui': join(uiModuleRoot, 'src'),
        'themes': join(themesModuleRoot, 'packages')
      }
    }
  })

  config.merge({
    recordsPath: join(directory, 'tmp', 'records')
  })

	if (options.exportLibrary) {
		config.merge({
			output: {
				library: options.exportLibrary,
				libraryTarget: 'umd'
			}
		})
	}

  inspect('Application Entry Points', entry, options.debug)

  return config
}

function excludeNodeModulesExceptSkypagers(absolutePath) {
  if (absolutePath.match(/node_modules/)){
    if(absolutePath.match(/skypager/) && absolutePath.match(/src/)) {
      return false
    }

    if(absolutePath.match(/skypager-themes/)){
      return false
    }

    return true
  }

  return false
}

function buildVendorStack(options) {
  if (options.vendor && typeof options.vendor === 'object') {
    return Object.keys(options.vendor)
  }

  return DefaultVendorStack
}

function buildExternals(options) {
  if (options.vendor && typeof options.vendor === 'object') {
    return Object.keys(options.vendor)
  }

  return ExternalVendorMappings
}

function inspect(note, obj, debuggingEnabled = false) {
  if (!debuggingEnabled) { return  }
  console.log("")
  console.log(note)
  console.log('------')

  console.log(
    colorize(omit(obj,'commands', 'options', '_execs', '_allowUnknownOption', '_args', '_name', '_noHelp', 'parent', '_alias', '_description', '_events', '_eventsCount'))
  )

  console.log("\n\n\n")
}
