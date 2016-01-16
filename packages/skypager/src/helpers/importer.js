/**
* Importers are special functions which import a URI such as a local
* path and turn it into a Project, or in some cases an Entity or a
* collection of Entities.
*/

import Helper from './helper'

export default class Importer extends Helper {
  get helperType () {
    return 'importer'
  }

  get helperClass () {
    return Importer
  }
}
