describe('The Skypager Project Bundle', function (){
  xit('contains a single JSON package for the entire project', function(){
    let project = require('../fixture')
    let exported = require('../fixture/dist/bundle.js')
    exported.should.be.an.Object()
  })
})

const { keys } = Object
