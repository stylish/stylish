action("Create Project Folders")

commandPhrase('create project folders')

execute(function(options = {}, context = {}) {
  let project = {context}
  let mkdir = require('mkdirp').sync

  ['docs','data/settings','src','models','actions','assets'].forEach(folder => {
    mkdir(project.join(folder))
  })
})
