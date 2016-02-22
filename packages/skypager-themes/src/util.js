import { readFileSync as readFile } from 'fs'

export function extractLessVars (fromFile, includeComments = false) {
  let content = readFile(fromFile).toString()

  let lines = content.split('\n').filter(
    line => `${line}`.trim().match(/\@\w+\:/)
  )

  return lines.reduce(
    (variables, line) => {
      let [variable, data] = line.split(':')
      let [value, comment] = `${ data }`.split(/\;/)

      variables[variable] = {value, comment}

      return variables
    },{}
  )
}
