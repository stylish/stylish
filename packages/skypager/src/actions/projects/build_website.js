/*action('build project website')

describe('create a production build of the website')

parameters({
  preset: {
    doc: 'Presets let you group together different configuration settings under an easy to remember name.'
    type: 'enum',
    options: function(project) {
      return require('skypager-devpack').availablePresets(project)
    }
  },
  theme: {
    doc: 'Select a theme from the skypager-themes library',
    type: 'enum',
    options: function(project) {
      return require('skypager-themes').availableThemes(project)
    }
  }
})

execute(function (params = {}, context = {}) {
  let devpack = require('skypager-devpack')
})
*/
