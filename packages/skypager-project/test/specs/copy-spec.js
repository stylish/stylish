describe('Copy and Internationalization', function(){
  let project = require('../fixture')

  it('should give me copy for a website', function(){
    project.copy.website.main.subtitle.should.match(/la mia morte/)
  })
})
