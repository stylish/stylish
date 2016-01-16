import Asset from './asset'

const EXTENSIONS = ['jpg', 'gif', 'svg', 'png']
const GLOB = '**/*.{' + EXTENSIONS.join(',') + '}'

class Image extends Asset {

}

Image.EXTENSIONS = EXTENSIONS
Image.GLOB = GLOB

exports = module.exports = Image
