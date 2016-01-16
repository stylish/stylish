import Skypager from '../src/index'

Object.defineProperties(Skypager, {
  fixture: {
    configurable: true,
    get: function(){
      return require('./fixture')
    }
  },
  fresh: {
    get: function(){
      Skypager.load(require.resolve('./fixture'), {
        name: 'Skypager Core Documentation',
        manifest: require(__dirname + '/fixture/package.json'),
        resolver:{
          modelPatterns: {
            testcase: /-spec/
          }
        }
      })
    }
  }
})
module.exports = Skypager
