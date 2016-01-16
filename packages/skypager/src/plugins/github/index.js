plugin('Github')

dependencies('octokit')

isSupported(function (target, plugin) {
  return false
})

modify(function (target, plugin) {
  switch (target.type) {
    case 'framework':
      break
    case 'project':
      break
  }
})


