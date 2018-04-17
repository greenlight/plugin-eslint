const { CLIEngine } = require('eslint')
const { createHash } = require('crypto')
const { relative } = require('path')
const glob = require('fast-glob')

module.exports = function (settings = {}, cwd = '/source', stdout = process.stdout, stderr = process.stderr) {
  const options = settings.options || {}

  // set working directory
  options.cwd = cwd

  const engine = new CLIEngine(options)

  // set defaults
  settings.include = settings.include || ['**/**.js']
  settings.exclude = settings.exclude || ['**/node_modules/**']

  // ensure exclude paths are prefixed with `!`
  settings.exclude = settings.exclude.map(path => `!${path}`)

  process.stderr.write(JSON.stringify(settings))
  return glob(settings.include.concat(settings.exclude), { cwd, absolute: true })
    .then(files => engine.executeOnFiles(files))
    .then(output => CLIEngine.getErrorResults(output.results))
    .then(errors => {
      for (const { filePath, messages } of errors) {
        for (const { ruleId, severity, message, line, column } of messages) {
          let id = [ filePath, ruleId, line, column ].join(':')
          id = createHash('sha1').update(id).digest('hex')

          const issue = {
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
          }

          stdout.write(JSON.stringify(issue))
          stdout.write('\0')
        }
      }
    })
    .catch(error => stderr.write(JSON.stringify(error)))
}
