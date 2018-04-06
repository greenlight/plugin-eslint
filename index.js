#!/usr/bin/env node

const info = require('./lib/info')
const run = require('./lib/run')

const command = process.argv[2]

if (command === 'info') {
  console.log(JSON.stringify(info))
  process.exit(0)
}

if (command === 'run') {
  run()
    .then(JSON.stringify)
    .then(console.log)
}
