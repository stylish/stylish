import mdast from 'mdast'
import yaml from 'mdast-yaml'
import _html from 'mdast-html'
import squeeze from 'mdast-squeeze-paragraphs'
import normalize from 'mdast-normalize-headings'
import visit from 'unist-util-visit'

export const renderer = mdast.use([yaml, squeeze, normalize, _html])

export function html (ast) {
  return renderer.stringify(ast)
}

export default html
