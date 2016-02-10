var path = require('path')
var src = path.join(__dirname, 'src')

module.exports = {
  target: 'node',
  entry: './src/index',
  output: {
    path: 'dist',
    library: 'skypager',
    filename: 'index.js'
  },
  module:{
    loaders:[{
      test: /\.js$/,
      loader: 'babel',
      include:[
        src
      ],
      exclude:[
         /node_modules/
      ]
      query:{
        presets:['skypager']
      }
    }]
  }
}
