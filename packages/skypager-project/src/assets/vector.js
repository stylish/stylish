import Asset from './asset'

// can parse / index / transform with xml
export class Vector extends Asset {
  static EXTENSIONS = ['svg'];
  static GLOB = '**/*.svg';
}

export default Vector
