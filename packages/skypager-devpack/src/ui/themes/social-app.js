module.exports = function Marketing(options = {}) {
  let { env, directory, theme } = options
  return `skypager-themes?theme=${ theme || 'marketing' }&env=${ env }!${directory}/package.json`
}
