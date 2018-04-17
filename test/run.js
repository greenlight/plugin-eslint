const { join } = require('path')
const { test } = require('tap')
const Ajv = require('ajv')
const schema = require('@greenlight/schema-report')
const run = require('../lib/run')

const ajv = new Ajv()
const validate = ajv.compile(schema)
const fixtures = join(__dirname, 'fixtures')

test('success run', assert => {
  assert.plan(5)

  const stream = {
    write: (out) => {
      if (out === '\0') return
      const valid = validate(JSON.parse(out))
      assert.ok(valid)
    }
  }

  assert.resolves(run({}, fixtures, stream))
})

test('no config found', assert => {
  assert.plan(2)

  const stream = {
    write: (out) => {
      if (out === '\0') return
      assert.match(JSON.parse(out), { messageTemplate: 'no-config-found' })
    }
  }

  assert.resolves(run({}, __dirname, null, stream))
})
