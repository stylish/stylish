import Asset from './asset'

const EXTENSIONS = ['css', 'less', 'scss', 'sass']
const GLOB = '**/*.{' + EXTENSIONS.join(',') + '}'

/**
* Ideas:
*
* Parse a stylesheet to learn about the rules it exposes
*/
class Stylesheet extends Asset {

}

exports = module.exports = Stylesheet
