import mapValues from 'lodash/mapValues'
import omit from 'lodash/omit'
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
  'redux-simple-router'
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
  'history': 'History'
}

module.exports = function (argv) {
  inspect('Options', argv, argv.debug)

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

  const env = argv.env || argv.environment || process.env.NODE_ENV || 'development'
  const config = new Config()
  const directory = argv.root || process.cwd()

	const isDev = (env === 'development')
  const fontsPrefix = argv.fontsPrefix || 'fonts'

  const themesModuleRoot = path.dirname(require.resolve('skypager-themes'))
  const devpackModuleRoot = path.join(__dirname, '../..')

  const modulesDirectories = [
    directory,
    join(directory,'src'),
    devpackModuleRoot,
    join(devpackModuleRoot, 'src'),
    themesModuleRoot,
    join(directory, 'node_modules'),
    join(devpackModuleRoot, 'node_modules')
  ]

  const platform = argv.platform || 'web'
  const precompiled = argv.precompiled || argv.usePrecompiledTemplate

  let projectThemePath = argv.projectThemePath || join(themesModuleRoot, 'packages/default')
  let entry = {}

  if (argv.entryPoints && argv.devpack_api === 'v2') {
    entry = assign(entry, argv.entryPoints)
  } else {
    entry = assign(entry, {
      [argv.entryName || 'app']: [ argv.entry || './src' ],
    })
  }

  entry = mapValues(entry, (v,k) => typeof v === 'string' ? [v] : v)

  if (!entry.theme && argv.theme) {
    entry.theme = [
      argv.theme.match(/\//) ? argv.theme : `themes/${ argv.theme }`
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

  if (!argv.noVendor) {
    entry.vendor = buildVendorStack(argv)
  }

  config
    .plugin('common-chunks', webpack.optimize.CommonsChunkPlugin, [{ names: ['vendor'] }])

	var outputPath = argv.outputFolder ? path.resolve(argv.outputFolder)  : join(directory, 'public')

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

  if (argv.htmlTemplatePath) {
    templatePath = path.resolve(argv.htmlTemplatePath)
  }

  var htmlFilename = argv.htmlFilename || argv.outputFile || 'index.html'

  if (env === 'production' && platform === 'web' && !argv.htmlFilename && argv.pushState) {
    htmlFilename = '200.html'
  }

  config
    .merge({
      entry: entry,
      output: {
        path: outputPath,
        filename: (argv.noContentHash || argv.contentHash === false || isDev ? '[name].js' : '[name]-[hash].js'),
        publicPath: (!isDev && platform === 'electron') ? '' : '/',
        contentBase: argv.contentBase || join(directory, 'src')
      },
      resolveLoader: {
        root: modulesDirectories
      },
      resolve: {
				root: modulesDirectories,
        fallback: argv.moduleFallback || devpackModuleRoot,
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

    .loader('less', {
      test: /\.less$/,
      include:[
        join(directory, 'src'),
        join(devpackModuleRoot, 'src', 'ui')
      ],
      exclude:[
        excludeNodeModulesExceptSkypagers,
        themesModuleRoot,
        projectThemePath
      ],
      loader: isDev ? 'style!css?modules&localIdentName=[path]-[local]-[hash:base64:5]!postcss!less'
                     : ExtractTextPlugin.extract('style-loader', 'css-loader?modules&sourceMap!postcss-loader!less')

    })

    .loader('url-1', { test: /\.woff(\?.*)?$/,  loader: 'url?prefix=' + fontsPrefix + '/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' })
    .loader('url-2', { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=' + fontsPrefix + '/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' })
    .loader('url-3', { test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=' + fontsPrefix + '/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' })
    .loader('file', { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=' + fontsPrefix + '/&name=[path][name].[ext]' })
    .loader('url-4', { test: /\.svg(\?.*)?$/,   loader: 'url?prefix=' + fontsPrefix + '/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' })
    .loader('url-5', { test: /\.(png|jpg)$/,    loader: 'url?limit=8192' })
		.loader('ejs', {test:/\.ejs/, loader: 'ejs'})

  config
    .plugin('webpack-order', webpack.optimize.OccurenceOrderPlugin)
    .plugin('webpack-dedupe', webpack.optimize.DedupePlugin)


	let featureFlags = {
		'__PLATFORM__': JSON.stringify(platform),
    '__SKYPAGER_THEME_CONFIG__': JSON.stringify(
      argv.themeConfigPath || join(directory, 'package.json')
    ),
		'process.env': {
			NODE_ENV: JSON.stringify(env)
		}
	}

	if (argv.featureFlags) {
		if (exists(resolve(argv.featureFlags))) {
			try {
				var extras = require(argv.featureFlags)
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

	let staticAssets = argv.staticAssets || {}

	let bodyScripts = staticAssets.bodyScripts || []
	let staticStyles = staticAssets.staticStyles || []
	let headerScripts = staticAssets.headerScripts || []
	let googleFont = staticAssets.googleFont || `http://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic`

	if (!argv.entryOnly && !argv.exportLibrary) {
		config.plugin('webpack-html', HtmlWebpackPlugin, [{
			template: `${ templatePath }`,
			hash: false,
			inject: argv.templateInject === 'none' ? false : (argv.templateInject || 'body'),
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

	if (argv.target) {
		config.merge({
			target: argv.target
		})
	}

  if (argv.externalVendors || precompiled ) {
    config.merge({
      externals: buildExternals(argv)
    })
  }

  if (!isDev) {
  	config .merge({ devtool: 'cheap-module-source-map' })

		let extractFilename = (platform === 'electron' || argv.noContentHash || argv.contentHash === false)
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
        'dist': (argv.distPath && resolve(argv.distPath)) || path.join(directory, 'dist'),
        'project-theme': projectThemePath
      }
    }
  })

  config.merge({
    recordsPath: join(directory, 'tmp', 'records')
  })

	if (argv.exportLibrary) {
		config.merge({
			output: {
				library: argv.exportLibrary,
				libraryTarget: 'umd'
			}
		})
	}

  inspect('Application Entry Points', entry, argv.debug)

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

function buildVendorStack(argv) {
  if (argv.vendor && typeof argv.vendor === 'object') {
    return argv.vendor
  }

  return DefaultVendorStack
}

function buildExternals(argv) {
  if (argv.externalVendors && typeof argv.externalVendors === 'object') {
    return argv.externalVendors
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
