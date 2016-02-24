'use strict';

/**
 * This is used to generate a template html file where the common elements in our stack
 * are available on window which will let us use webpack externals functionality to bring
 * these libraries in.  This is useful in development so we don't need to build these
 * libraries into the bundle, which results in faster load time in development
 */

window.jQuery = require('jquery');
window.React = require('react');
window.ReactDOM = require('react-dom');
window.ReactBootstrap = require('react-bootstrap');
window.Redux = require('redux');
window.Router = require('react-router');
window.ReduxActions = require('redux-actions');
window.ReduxThunk = require('redux-thunk');
window.ReduxSimpleRouter = require('redux-simple-router');
window.SkypagerUI = require('skypager-ui');
window.SkypagerApplication = require('skypager-application');

window.History = {
  browser: require('history/lib/createBrowserHistory'),
  memory: require('history/lib/createMemoryHistory')
};