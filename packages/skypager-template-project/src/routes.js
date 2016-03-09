import { createRoutes } from 'react-router'

module.exports = {
  path: '/',

  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      /* BEGIN INDEX ROUTE */
      cb(null, require('./entries/Home').default)
    })
  },

  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        /* BEGIN CHILD ROUTES */
        require('./entries/Documentation').default
      ])
    })
  }
}
