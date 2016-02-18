import defaults from 'lodash/defaultsDeep'

export function WebpackExporter (params = {}) {
  const project = params.project || this

  const { root, options, cacheKey, paths } = project

  let filename = params.filename || 'bundle.js'
  let library = params.library || filename.replace(/.js$/,'')

  let config = {
    context: project.root,
    target: 'node',
    entry: project.path('build','bundle','index.js'),
    output: {
      path: project.paths.build,
      filename,
      library,
      libraryTarget: 'umd'
    },
    module: {
      loaders: [
        {test: /\.json$/, loader: 'json'},
        {test: /\.(scss)/, loader: 'style!sass'},
        {test: /\.(less)/, loader: 'style!less'},
        {test: /\.css/, loader: 'style'}
      ]
    }
  }

  require('webpack')(config).run((err, stats) => {
    if(err) {
      console.log(err)
    }
  })
}
