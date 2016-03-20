var chai = require('chai')
var sinonChai = require('sinon-chai')
chai.use(sinonChai)

GLOBAL.should = chai.should()
GLOBAL.assert = chai.assert
