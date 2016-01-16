/**
*
* Queries the NPM database to find all packages with the skypager prefix.
*
* @public 
*
* This exists in the project to show how data can be pulled in a
* completely custom way through the use of javascript functions which
* are expected to return a structured object for an entity.
*/

function CommunityPlugins(project){
  var dataSource = project.datasources.create('Skypager Community Plugins')
 
  dataSource.model = 'CommunityPlugin'

  dataSource.data = []
}

module.exports = CommunityPlugins
