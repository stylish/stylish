#!/usr/bin/env node

const argv = require('yargs').argv

require('../lib/server')(argv)
