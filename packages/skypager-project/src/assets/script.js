import Asset from './asset'

export const EXTENSIONS = ['js', 'jsx', 'cjsx', 'coffee', 'es6']
export const GLOB = '**/*.{' + EXTENSIONS.join(',') + '}'

// can parse, index, transform js with babel
export class Script extends Asset {

}

export default Script
