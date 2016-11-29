#!/usr/bin/env node

/** This script runs an npm command for every registered package
 * in the file `RELEASABLE_PACKAGES`.
 *
 * E.g.: calling this script will the command line args "run test"
 * will execute `npm run test` for each package.
*/

'use strict';

var fs = require('fs');
var path = require('path');
var execSync = require('child_process').execSync;

var argArray = process.argv.slice(2);
var command = argArray.join(' ');

var releasablePackages = fs
  .readFileSync(path.resolve(__dirname, 'RELEASABLE_PACKAGES'), 'utf8')
  .trim()
  .split(/\r?\n/);

function handleError(error) {
  switch(error.code) {
    case 'ENOENT':
      console.error('No such file or directory: ' + error.options.cwd );
      break;
    default:
      console.error('Error: \n' + err.message);
      break;
  }
}

function runCommand(command) {
  return function runCommandIn(dir) {
    console.log('> (' + dir + ')');
    console.log("> npm " + command + '\n');
    try {
      execSync(
        'npm ' + command, 
        {
          cwd: path.resolve(dir),
          stdio: 'inherit'
        }
      );
    } catch(err) {
      handleError(err);
    }
  }
}

if (argArray.length === 0)  {
  console.error('No command supplied');
  process.exit();
}

if (releasablePackages.length === 0)  {
  console.error('No directories supplied');
  process.exit();
}

releasablePackages.forEach(runCommand(command));