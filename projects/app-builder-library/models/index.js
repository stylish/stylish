module.exports = function LoadModels () {
  load(require.resolve('./application'))
  load(require.resolve('./blueprint'))
  load(require.resolve('./component'))
  load(require.resolve('./entry_point'))
  load(require.resolve('./feature'))
  load(require.resolve('./integration'))
  load(require.resolve('./resource'))
  load(require.resolve('./theme'))
}
