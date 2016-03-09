import Asset from './asset'
import docblock from '../utils/docblock'

const EXTENSIONS = ['js', 'jsx', 'cjsx', 'coffee', 'es6']
const GLOB = '**/*.{' + EXTENSIONS.join(',') + '}'

// can parse, index, transform js with babel
export class Script extends Asset {
  static EXTENSIONS = EXTENSIONS;
  static GLOB = GLOB;

  getData () {
    if ((!this.raw || this.raw.length === 0)) {
      this.runImporter('disk', {asset: this, sync: true})
    }

    return this.frontmatter || {}
  }

  get frontmatter() {
    try {
      return docblock.parse(this.raw)
    } catch(error) {
      return {}
    }
  }

  generateId() {
     let base = `${this.paths.relative.replace(this.extension, '')}`

     if (base.match(/\/index$/)) {
       base = base.replace(/\/index$/,'')
     }

     return base
  }
}

export default Script
