module.exports = function (skypager) {
  if (!process.env.SKYPAGER_DIST) { load(require.resolve('./disk'), 'disk') }
}
