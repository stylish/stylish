import Asset from './asset'
import docblock from '../utils/docblock'

export const EXTENSIONS = ['js', 'jsx', 'cjsx', 'coffee', 'es6']
export const GLOB = '**/*.{' + EXTENSIONS.join(',') + '}'

// can parse, index, transform js with babel
export class Script extends Asset {
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
}

export default Script
