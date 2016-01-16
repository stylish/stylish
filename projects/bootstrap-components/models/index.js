module.exports = function LoadModels () {
  load(require.resolve('./component'))
  load(require.resolve('./layout'))
  load(require.resolve('./theme'))
  load(require.resolve('./skeleton'))
  load(require.resolve('./landing'))
}
