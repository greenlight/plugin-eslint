const { join } = require('path')
const { test } = require('tap')
const Ajv = require('ajv')
const schema = require('@greenlight/schema-report')
const run = require('../lib/run')

// force AJV to be async
schema.$async = true

const ajv = new Ajv()
const validate = ajv.compile(schema)
const fixtures = join(__dirname, 'fixtures')

test('success run', assert => {
  assert.plan(1)

  assert.resolves(run(fixtures).then(validate))
})

test('no config found', assert => {
  assert.plan(1)

  assert.resolves(run(__dirname).then(validate))
})
