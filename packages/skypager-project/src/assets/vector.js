import Asset from './asset'

// can parse / index / transform with xml
class Vector extends Asset {

}

Vector.EXTENSIONS = ['svg']
Vector.GLOB = '**/*.svg'


exports = module.exports = Vector
