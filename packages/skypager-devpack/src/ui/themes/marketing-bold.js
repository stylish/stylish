module.exports = function MarketingBold(options = {}) {
  let { env, directory, theme } = options
  return `skypager-themes?theme=${ theme || 'marketing-bold' }&env=${ env }!${directory}/package.json`
}
