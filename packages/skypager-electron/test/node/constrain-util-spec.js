import {
  constrain,
  size,
  leftPos,
  topPos
} from '../../src/util/constrain'

const bounds = {
  height: 1000,
  width: 1000
}

describe('constrain util', () => {
  describe("positioning", () => {

  })

  describe("sizing", () => {
    it ("should handle percentage", () => {
      size('50%', 1000).should.equal(500)
      size('100%', 1000).should.equal(1000)
    })
  })

  describe("constraining a window", ()=>{
    it('handles percentage', () => {
      let cfg = constrain({
        left: '25%',
        top: '20%',
        height: 500,
        width: 500
      }, bounds)

      cfg.should.have.property('left', 250)
      cfg.should.have.property('top', 200)
    })

    it('handles right and bottom', () => {
      let cfg = constrain({
        right: '25%',
        bottom: '20%',
        height: 500,
        width: 500
      }, bounds)

      cfg.should.have.property('left', 250)
      cfg.should.have.property('top', 300)
    })

  })
})
