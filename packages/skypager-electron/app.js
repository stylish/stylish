require('babel-register')({
  presets:[
    require.resolve('babel-preset-es2015')
  ],
  plugins:[
    require.resolve('babel-plugin-add-module-exports')
  ]
})

require('./src').enter()
