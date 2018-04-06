const { schema } = require('@greenlight/schema-plugin')
const { test } = require('tap')
const Ajv = require('ajv')

const info = require('../lib/info')

// force AJV to be async
schema.$async = true

const ajv = new Ajv()
const validate = ajv.compile(schema)

test('config', assert => {
  assert.plan(1)

  assert.resolves(validate(info))
})
