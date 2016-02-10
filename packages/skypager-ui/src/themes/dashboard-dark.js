module.exports = function DashboardDark(options = {}) {
  let { env, directory, theme } = options
  return `skypager-themes?theme=${ theme }&env=${ env }!${directory}/package.json`
}
