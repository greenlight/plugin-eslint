const { CLIEngine } = require('eslint')
const { createHash } = require('crypto')
const { Promise } = require('smart-promise')
const { relative } = require('path')
const glob = require('fast-glob')

module.exports = function (cwd = '/source', settings = {}) {
  const report = {
    version: '1.0.0',
    plugin: 'greenlight/eslint',
    issues: []
  }

  const engine = new CLIEngine({
    outputFile: false,
    quiet: false,
    maxWarnings: -1,
    fix: false,
    cwd
  })

  // set defaults
  settings.include = settings.include || ['**/**.js']
  settings.exclude = settings.exclude || ['**/node_modules/**']

  // ensure exclude paths are prefixed with `!`
  settings.exclude = settings.exclude.map(path => `!${path}`)

  return Promise.resolve()
    .then(_ => glob(settings.include.concat(settings.exclude), { cwd, absolute: true }))
    .then(files => engine.executeOnFiles(files))
    .then(output => CLIEngine.getErrorResults(output.results))
    .then(errors => {
      for (const { filePath, messages } of errors) {
        for (const { ruleId, severity, message, line, column } of messages) {
          let id = [ filePath, ruleId, line, column ].join(':')
          id = createHash('sha1').update(id).digest('hex')

          report.issues.push({
            id,
            name: ruleId,
            description: message,
            severity: severity === 1 ? 'info' : 'major',
            context: {
              type: 'file',
              path: relative(cwd, filePath),
              start: {
                line,
                column
              }
            }
          })
        }
      }

      return report
    })
    .catch(/No ESLint configuration found/, _ => report)
}
