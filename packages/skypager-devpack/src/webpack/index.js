module.exports = function (argv) {
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

  const env = process.env.NODE_ENV || 'development'
  const config = new Config()
  const directory = process.cwd()

	const isDev = (env === 'development')
  const fontsPrefix = argv.fontsPrefix || 'fonts'

  // this assumes the devpack is checked out and in skypager-central/packages/skypager-devpack
  const babelModulesPath = argv.modulesPath || process.env.SKYPAGER_MODULES_PATH || '../../../node_modules'

  const themesModuleRoot = path.dirname(require.resolve('skypager-themes'))
  const devpackModuleRoot = path.join(__dirname, '../..')

  const modulesDirectories = [
    devpackModuleRoot,
    path.join(devpackModuleRoot, 'src'),
    path.join(devpackModuleRoot, 'src', 'ui'),
    themesModuleRoot,
    `${directory}/node_modules`,
    path.join(devpackModuleRoot, 'node_modules'),
    path.join(themesModuleRoot, 'node_modules')
  ]

  const platform = argv.platform || 'web'

  const entry = {
    [argv.entryName || 'app']: [ argv.entry || './src' ],
  }

  const precompiled = argv.precompiled || argv.usePrecompiledTemplate

  if (env === 'development') {
    entry.app.unshift('webpack-hot-middleware/client')
  }

  if (!precompiled && !argv.skipTheme && argv.theme) {
    entry.theme = [`skypager-themes?theme=${ argv.theme }&env=${argv.env}!${directory}/package.json`]
  }

	var outputPath = path.resolve(
		argv.outputFolder || join(directory, 'public')
	)

  var templatePath = `${__dirname}/../../templates/index.html`

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

  var htmlFilename = argv.htmlFilename || 'index.html'

  if (env === 'production' && platform === 'web' && !argv.htmlFilename && argv.pushState) {
    htmlFilename = '200.html'
  }

  config
    .merge({
      entry: entry,
      output: {
        path: outputPath,
        filename: (argv.noContentHash || argv.contentHash === false || isDev ? '[name].js' : '[name]-[hash].js'),
        publicPath: (!isDev && platform === 'electron') ? '' : '/'
      },
      resolveLoader: {
        root: modulesDirectories
      },
      resolve: {
				root: modulesDirectories.concat([
          directory,
          path.dirname(
            require.resolve('skypager-devpack')
          )
				]),
				modulesDirectories:[
          '.',
					'src',
          'dist',
          'node_modules'
				]
      },
      devtool: 'eval'
    })

		.loader('json', {loader: 'json', test:/.json$/})

    .loader('js', {
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: [
        path.join(process.env.PWD, 'dist', 'bundle'),
        /node_modules/
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

    .loader('js2', {
      test: /skypager-devpack\/src.*\.jsx?$/,
      loader: 'babel',
      query: {
        presets: [require.resolve('babel-preset-skypager')],
        env: {
          development: {
            presets: [require.resolve('babel-preset-react-hmre')]
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
		.loader('ejs', {test:/\.ejs/, loader: 'ejs'})

    .plugin('webpack-order', webpack.optimize.OccurenceOrderPlugin)
    .plugin('webpack-noerrors', webpack.NoErrorsPlugin)


	let featureFlags = {
		'__PLATFORM__': JSON.stringify(platform),
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
    config.plugin('webpack-hmr', webpack.HotModuleReplacementPlugin)
  }


  if ((argv.noVendorLibraries || argv.vendorLibraries !== false) && !argv.externalVendors && !precompiled) {
    config.merge({
      entry: {
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
          //'skypager-ui',
          //'skypager-application'
        ]
      }
		})

    config.plugin('common-chunks', webpack.optimize.CommonsChunkPlugin, [{ names: ['vendor'] }])
  }

	if (argv.target) {
		config.merge({
			target: argv.target
		})
	}
  if (argv.externalVendors || precompiled ) {
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
    })
  }

  // production
  if (!isDev) {
  	config .merge({ devtool: 'cheap-module-source-map' })


		let extractFilename = (platform === 'electron' || argv.noContentHash || argv.contentHash === false) ? '[name].js' : '[name]-[hash].js'

		config
      .plugin('extract-text', ExtractTextPlugin, [extractFilename, {
        allChunks: true
      }])

      /*.plugin('webpack-uglify', webpack.optimize.UglifyJsPlugin, [{
        compressor: { warnings: false },
        compress: {
          unused: true,
          dead_code: true
        }
      }])*/
  }

  config.merge({
    resolve:{
      alias: {
        'dist': (argv.distPath && resolve(argv.distPath)) || path.join(directory, 'dist')
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

  return config
}
