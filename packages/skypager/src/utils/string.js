import { inflections } from 'utile'

export function humanize (s) {
  return inflections.humanize(s).replace(/-|_/g, ' ')
}

export function titleize (s) {
  return inflections.titleize(
    humanize(s)
  )
}

export function classify (s) {
  return inflections.classify(s)
}

export function tableize (s) {
  return inflections.tableize(s)
}

export function tabelize (s) {
  return inflections.tableize(s)
}

export function underscore (s) {
  s = s.replace(/\\|\//g, '-', '')
  s = s.replace(/[^-\w\s]/g, '')  // remove unneeded chars
  s = s.replace(/^\s+|\s+$/g, '') // trim leading/trailing spaces
  s = s.replace('-', '_')
  s = s.replace(/[-\s]+/g, '_')   // convert spaces to hyphens
  s = s.toLowerCase()             // convert to lowercase
  return s
}

export function parameterize (s) {
  s = s.replace(/\\|\//g, '-', '')
  s = s.replace(/[^-\w\s]/g, '')  // remove unneeded chars
  s = s.replace(/^\s+|\s+$/g, '') // trim leading/trailing spaces
  s = s.replace(/[-\s]+/g, '-')   // convert spaces to hyphens
  s = s.toLowerCase()             // convert to lowercase
  return s
}

export function slugify (s) {
  return parameterize(s)
}

export function singularize (...args) {
  return inflections.singularize(...args)
}

export function pluralize (...args) {
  return inflections.pluralize(...args)
}
