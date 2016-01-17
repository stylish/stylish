#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const themes_root = path.join(__dirname, 'src', 'themes')

program.parse(process.argv)

console.log('Program', program)
