module.exports = function run_disk_exporter (options = {}) {
  var fs = require('fs'),
      path = require('path'),
      exists = fs.existsSync,
      mkdir = fs.mkdirSync,
      writeFile = fs.writeFileSync,
      readFile = fs.readFileSync

  var project = options.project = options.project || this,
      type = options.type || 'snapshot',
      filename = options.filename || type,
      format = options.format || 'json',
      path = options.path || project.path('build', filename + '.' + format),
      payload = options.payload ? options.payload : project.run.exporter(type, options),
      serialized = '';

      if (format === 'json' || format === 'js') {
        serialized = JSON.stringify(payload)

        if (format === 'js') {
          serialized = `module.exports = JSON.parse(${ JSON.stringify(payload) })`
        }
      }

      if (serialized.length > 0) {
        writeFile(path, serialized)
      }

  return path
}


