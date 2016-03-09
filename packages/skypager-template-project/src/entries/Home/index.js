export const Home = {
  isIndex: true,

  getComponent(location, cb) {
    require.ensure([], function(require) {
      cb(null, require('./components/Home'))
    })
  }
}

export default Home
