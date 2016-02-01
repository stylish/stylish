import Asset from './asset'
import babel from 'babel-core'

export const EXTENSIONS = ['js', 'jsx', 'cjsx', 'coffee', 'es6']
export const GLOB = '**/*.{' + EXTENSIONS.join(',') + '}'

// can parse, index, transform js with babel
export class Script extends Asset {
  parse () {
    let options = this.project.manifest && this.project.manifest.babel

    if (!options) {
      options = { presets:['es2015'], plugins:['syntax-async-functions','transform-regenerator'] }
    }

    if (this.raw) {
      return (babel && babel.transform(this.raw, options)) || this.raw
    } else {
      return (babel && babel.transformFileSync(this.raw, options)) || this.raw
    }
  }
}

export default Script
