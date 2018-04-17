#!/usr/bin/env node

const settings = require('/settings.json')
const run = require('./lib/run')

run(settings)
