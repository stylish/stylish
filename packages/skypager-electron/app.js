require('babel-register')({
  presets:[
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-react')
  ],
  plugins:[
    require.resolve('babel-plugin-add-module-exports')
  ]
})

require('./src').enter()
