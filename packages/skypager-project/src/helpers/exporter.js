/**
*
* Exporters are functions which get run on a Project or Entity and can be used to transform that project
* into some other form, for example a static html website, a react application, a zip, or a PDF.
*
*/

import Helper from './helper'

export default class Exporter extends Helper {
  get helperType () {
    return 'exporter'
  }

  get helperClass () {
    return Exporter
  }
}
