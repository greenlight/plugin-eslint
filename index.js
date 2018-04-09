#!/usr/bin/env node

const run = require('./lib/run')

run()
  .then(JSON.stringify)
  .then(console.log)
