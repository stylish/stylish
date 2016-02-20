#!/usr/bin/env node

'use strict';

require('colors');

var fs = require('fs'),
    path = require('path'),
    lodash = require('lodash'),
    exists = fs.existsSync,
    cwd = process.env.PWD,
    filter = lodash.filter;

var requiredPackages = ['skypager-project'];
var suggestedPackages = ['skypager-devpack','skypager-themes','skypager-server'];

var missingRequirements = filter(requiredPackages, isMissing);
var missingSuggested = filter(suggestedPackages, isMissing)

if (missingRequirements.length > 0) {
  missingRequirements.forEach(function(pkg) {
    //abort('The required package ' + pkg.magenta + ' is not found. npm install \'skypager\' should provide it.')
  })
}

if (missingSuggested.length > 0) {
  missingSuggested.forEach(function(pkg) {
    //warn('The package ' + pkg.magenta + ' was not found. We suggest installing it.')
  })
}

require('skypager-project/bin/cli')

function isMissing(mod) {
  try {
    require.resolve(mod)
    return false
  } catch(e) {
    return true;
  }
}

function warn(msg) {
  console.log('WARN: '.yellow + msg);
}

function abort(msg) {
  console.log('ERROR: '.magenta + msg);
  process.exit(1, msg);
}
