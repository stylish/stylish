var menubar = require('menubar')

var mb = menubar({
  index: 'file://' + __dirname + '/public/index.html',
  icon: 'file://' + __dirname + '/assets/icons/IconTemplate.png'
})

mb.on('ready', function ready () {
  console.log('app is ready')
})
