import Asset from './asset'

const EXTENSIONS = ['jpg', 'gif', 'svg', 'png']
const GLOB = '**/*.{' + EXTENSIONS.join(',') + '}'

export class Image extends Asset {
  static EXTENSIONS = EXTENSIONS;
  static GLOB = GLOB;
}

export default Image
