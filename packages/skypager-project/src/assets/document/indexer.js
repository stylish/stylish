import { clone, flatten, lazy, hide, slugify, assign } from '../../util'

import * as queryInterface from './query_interface'

module.exports = function (ast, document) {
  return indexChildren(ast, document)
}

function indexChildren (ast, document) {
  ast = clone(ast)

  let nodes = ast.children
  let currentDepth = 1
  let childIndex = 0
  let currentParent = document.slug

  hide.property(document, 'indexes', {ids: {}, depths: {}, types:{}, childrenIndexes:{}}, true)

  assign(document.indexes.depths, { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] })

  let depthTracker = { }

  let { types, childrenIndexes, ids, depths } = document.indexes

  nodes.forEach((node, index) => {
    // map different attributes of each node to their index
    // so we can easily filter them later

    node.index = index

    indexType(types, node)

    if (node.type === 'heading') {
      // assigns an id to the node based on a slug
      tagHeading(node)

      // e.g. if we're an h3 and our previous heading was an h2
      if (node.depth > currentDepth) {
        node.parentId = currentParent
      }

      // use our previous siblings parent
      if (node.depth <= currentDepth && depthTracker[node.depth]) {
        node.parentId = depthTracker[node.depth].parentId
      }

      // store the last one
      depthTracker[node.depth] = node
      depths[node.depth].push(index)
      currentDepth = node.depth
      currentParent = node.id
      childIndex = 0

      // this will almost always be one but we need to know if not
      if (!document.startDepth || currentDepth < document.startDepth) {
        document.startDepth = currentDepth
      }

    } else {
      node.depth = currentDepth
      node.parentId = currentParent
      node.childIndex = childIndex++
      node.childId = [alias(node.type), node.depth, childIndex].join('-')
      node.id = [node.parentId, node.childId].join('-')
    }

    if (!node.parentId) {
      node.parentId = document.slug
    }

    indexParent(childrenIndexes, node)

    ids[node.id] = index
  })

  nodes.forEach(node => queryInterface.applyToNode(node, {document, nodes}))

  return ast
}

function alias (nodeType) {
  let aliases = {
    'paragraph': 'p'
  }

  return aliases[nodeType] ? aliases[nodeType] : nodeType
}

function indexParent (parents, node) {
  if (!parents[node.parentId] || !parents[node.parentId].push) {
    parents[node.parentId] = []
  }

  parents[node.parentId].push(node.index)
}

function indexType (types, node) {
  if (!types[node.type] || !types[node.type].push) {
    types[node.type] = []
  }

  types[node.type].push(node.index)
}

function tagHeading (node) {
  let {children} = node
  let [text] = children
  let value = text && text.value
  let data = node.data || (node.data = {})
  let attrs = data.htmlAttributes = data.htmlAttributes || (data.htmlAttributes = {})

  node.id = attrs.id = slugify(value)

  assign(node, {
    get value () { return value }
  })

  return node
}

