import mdast from 'mdast'
import yaml from 'mdast-yaml'
import html from 'mdast-html'
import squeeze from 'mdast-squeeze-paragraphs'
import normalize from 'mdast-normalize-headings'
import visit from 'unist-util-visit'

const markdown = mdast.use([yaml, squeeze, normalize, html])

export default function parse (content, document) {
  return markdown.parse(content)
}
