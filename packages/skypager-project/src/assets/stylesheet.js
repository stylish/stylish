import Asset from './asset'

const EXTENSIONS = ['css', 'less', 'scss', 'sass']
const GLOB = '**/*.{' + EXTENSIONS.join(',') + '}'

/**
* Ideas:
*
* Parse a stylesheet to learn about the rules it exposes
*/
export class Stylesheet extends Asset {
  static EXTENSIONS = EXTENSIONS;
  static GLOB = GLOB;

  get imports() {
    return ['TODO: list which dependencies it imports']
  }

  get usesVariables() {
    return ['TODO: list which variables it uses']
  }

  get variables() {
     return ['TODO: list which variables it defines']
  }
}

export default Stylesheet
