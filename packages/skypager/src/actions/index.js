module.exports = function ActionsLoader () {
  // doing this the hard way to cooperate w/ webpack
  load(
    require.resolve('./projects/create_folders')
  )
}
