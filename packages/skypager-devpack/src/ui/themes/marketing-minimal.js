module.exports = function MarketingMinimal(options = {}) {
  let { env, directory, theme } = options
  return `skypager-themes?theme=${ theme || 'marketing-minimal' }&env=${ env }!${directory}/package.json`
}
