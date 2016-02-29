export function execSync(cmd) {
  return require('child_process').execSync(cmd, {
    encoding: 'utf8'
  }).trim()
}
