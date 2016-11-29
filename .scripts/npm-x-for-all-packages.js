#!/usr/bin/env node

'use strict'

var fs = require('fs')
var path = require('path')
var execSync = require('child_process').execSync
var argArray = process.argv.slice(2)
var command = argArray.join(' ')
var dirArray = [];

function handleError(error) {
  switch(error.code) {
    case 'ENOENT':
      console.error('No such file or directory: ' + error.options.cwd )
      break
    default:
      console.error('Error: \n' + err.message)
      break
  }
}

function runCommand(command) {
  return function runCommandIn(dir) {
    console.log("> (" + dir + ")")
    console.log("> npm " + command)
    try {
      execSync(
        'npm ' + command, 
        {
          cwd: path.resolve(dir),
          stdio: 'inherit'
        }
      )
    } catch(err) {
      handleError(err)
    }
  }
}

if (argArray.length === 0)  {
  console.error('No command supplied')
  process.exit()
}

dirArray = fs
  .readFileSync(path.resolve(__dirname, 'RELEASABLE_PACKAGES'), 'utf8')
  .split(/\r?\n/)
  .filter(function(dir) { return dir.length !== 0 })

if (dirArray.length === 0)  {
  console.error('No directories supplied')
  process.exit()
}

dirArray.forEach(runCommand(command))