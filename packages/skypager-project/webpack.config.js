var path = require('path')
var fs = require('fs')
var src = path.join(__dirname, 'src')

var nodeModules =
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .reduce(function(memo, mod) {
    return (memo[mod] = 'commonjs ' + mod) && memo
  });

console.log('Node Modules', nodeModules)

module.exports = {
  target: 'node',
  entry: './src/index',
  debug: true,
  node: {
    __dirname: true,
    __filename: true
  },
  output: {
    path: 'dist',
    library: 'skypager',
    filename: 'index.js'
  },
  externals: nodeModules,
  recordsPath: path.join(__dirname, 'dist', '_records'),

  plugins: [
    //new webpack.IgnorePlugin(/\.(css|less)$/),
    /*new webpack.BannerPlugin('require("source-map-support").install();',
                             { raw: true, entryOnly: false }),*/
    //new webpack.HotModuleReplacementPlugin({ quiet: true })
  ],

  module:{
    loaders:[{
      test: /\.js$/,
      loader: 'babel',
      include:[
        src
      ],
      exclude:[
         /node_modules/
      ],
      query:{
        presets:['skypager']
      }
    }]
  }
}
