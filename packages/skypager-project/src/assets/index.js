import { values, flatten } from '../util'

import Asset from './asset'
import DataSource from './data_source'
import Document from './document'
import Image from './image'
import ProjectManifest from './project_manifest'
import Script from './script'
import SettingsFile from './settings_file'
import Stylesheet from './stylesheet'
import Vector from './vector'

Object.assign(Asset, {
  get SupportedExtensions () {
    return [].concat(Asset.EXTENSIONS, DataSource.EXTENSIONS, Document.EXTENSIONS, Image.EXTENSIONS, Script.EXTENSIONS, Stylesheet.EXTENSIONS, Vector.EXTENSIONS).map(v => "."+v)
  }
})

module.exports = {
  Asset,
  DataSource,
  Document,
  Image,
  ProjectManifest,
  Script,
  Stylesheet,
  SettingsFile,
  Vector
}
