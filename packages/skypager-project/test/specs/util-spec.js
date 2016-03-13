import * as util from '../../src/util'

describe("Utils", function(){
  describe("No Conflict", function(){
    it("makes vars available in the global scope and cleans up after itself", function(){

      delete(global.clean_this_up)
      delete(global.no_conflict_var)

      global.no_conflict_var = 88

      let test = 1337

      let fn = function(){
        no_conflict_var.should.equal(99)

        if(no_conflict_var === 99){
          test = 69
        }
      }

      util.noConflict(fn, {clean_this_up: true, no_conflict_var: 99})()

      expect(global).to.have.property('no_conflict_var')
      expect(global).to.not.have.property('clean_this_up')
    })
  })
})
