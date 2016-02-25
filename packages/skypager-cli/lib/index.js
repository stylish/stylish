'use strict';

module.exports = {
  get paths() {
    return require('./dependencies').getPaths();
  }
};