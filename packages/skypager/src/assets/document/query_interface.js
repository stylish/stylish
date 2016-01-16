import { assign, hide, lazy, slugify, underscore, flatten } from '../../util'

module.exports = {
  nodes (document, type, params = {}) {
    return buildFilterInterface(document)
  },
  code (document, params = {}) {
    return buildCodeInterface(document)
  },
  headings (document, params = {}) {
    return buildHeadingsInterface(document)
  },
  applyToNode (...args) {
    return applyToNode(...args)
  }
}

function extractHeadingText (node) {
  if (typeof (node)==='object' && node.type === 'heading' && node.children) {
    return node.children[0].value
  }
}

function buildHeadingsInterface (document, scope, titleDepth) {
  let headingNodes = scope ? scope : nodesByType.call(document, 'heading')

  titleDepth = titleDepth || document.startDepth || 1

  return {
    section (heading, relative = false) {
      let nodes = document.nodes.at.id(slugify(heading)).descendants
      return buildHeadingsInterface(document, nodes)
    },

    /**
    * For specially named sections which have articles,
    * what are they called? this is a convenience method so
    * we can generate css class names to make them easily queryable
    */
    articleNameFor (sectionName) {
        if(document.modelDefinition && document.modelDefinition.sectionsConfig){
            let cfg = document.modelDefinition.sectionsConfig[ slugify(sectionName) ]

            if(cfg && cfg.config.articles) {
                return Object.values(cfg.config.articles)[0]
            }
        }
    },

    get titles () {
      return wrapQueryResponse(query(headingNodes, {depth: titleDepth}))
    },
    get sections () {
      return wrapQueryResponse(query(headingNodes, {depth: titleDepth + 1}))
    },
    get articles () {
      return wrapQueryResponse(query(headingNodes, {depth: titleDepth + 2}))
    },
    get minor () {
      let depths = [titleDepth + 3, titleDepth + 4, titleDepth + 5]
      return wrapQueryResponse(query(headingNodes, {depth: depths}))
    }
  }
}

function buildCodeInterface (document) {
  let blocks = nodesByType.call(document, 'code')
  return wrapCodeBlocks.call(document, blocks)
}

function wrapCodeBlocks (codeBlocks) {
  let document = this

  let i = {
    get languages () {
      return wrapQueryResponse(codeBlocks).pluck('lang').unique()
    },
    get all () {
      return wrapQueryResponse(codeBlocks)
    },

    get grouped () {
      return codeBlocks.reduce((memo, block) => {
        (memo[block.lang] = memo[block.lang] || []).push(block)
        return memo
      }, {})
    },

    under (heading, params = {}) {
      let results = document.nodes.at.id(slugify(heading)).descendants.filter(b => b.type === 'code')
      return wrapQueryResponse(results, params)
    }
  }

  codeBlocks.map(block => block.lang).forEach(lang => {
    if (!i[lang]) {
      Object.defineProperty(i, lang, {
        get: function () {
          return wrapQueryResponse(codeBlocks, {lang}) || []
        }
      })
    }
  })

  return i
}

function buildFilterInterface (document) {
  if (!document.indexes) { document.indexed }

  let types = Object.keys(document.indexes.types)

  let lines = document.indexes.lines
  let ids = document.indexes.ids

  let typeFilter = nodesByType.bind(document)

  let findById = function (id) {
    return document.indexed.children[ ids[id] ]
  }

  let i = {
    query: function (params = {}) {
      return query(document.indexed.children, params)
    },
    under: function (heading, params = {}) {
      let results = document.nodes.at.id(slugify(heading)).descendants
      return wrapQueryResponse(results, params)
    },
    including: function (heading, params = {}) {
      let headingNode = document.nodes.at.id(slugify(heading))
      let results = [headingNode].concat(document.nodes.at.id(slugify(heading)).descendants)

      return wrapQueryResponse(results, params)
    },
    type: typeFilter.bind(document),
    of: {
      type: typeFilter.bind(document)
    },
    at: assign(findById, {
      line: ((i) => document.indexed.children[ lines[i] ]),
      index: ((i) => document.indexed.children[i]),
      id: findById
    })
  }

  // document.nodes.headings
  types.forEach(type => {
    Object.defineProperty(i, type + 's', {
      enumerable: false,
      get: function () {
        return typeFilter(type)
      }
    })
  })

  return i
}

function nodesUnderHeading (heading, params) {
  let nodes = this.nodes.at.id(slugify(heading)).descendants
  return wrapQueryResponse(node, params)
}


function nodesByType (type, params) {
  let nodes = this.indexed.children
  let results = (this.indexes.types[type] || []).map(pointer => nodes[pointer])
  return wrapQueryResponse(results, params)
}

function queryNodes (params = {}) {
  let nodes = params.nodes || this.indexed.children
  return wrapQueryResponse(nodes, params)
}

function query (nodeList, params = {}) {
  return nodeList.filter(node => {
    return Object.keys(params).every(key => {
      let param = params[key]
      let value = node[key]

      if (isRegex(param) && param.test(value)) {
        return true
      }

      if (typeof (param)==='string' && value === param) {
        return true
      }

      if (typeof (param)==='number' && value === param) {
        return true
      }
    })
  })
}

function extractText (node) {
  if (node.children && node.children[0]) {
    if (node.children[0] && node.children[0].type === 'text' && node.children[0].value) {
      return node.children[0].value
    }
  }
}

function isRegex (val) {
  if (typeof (val)==='object' && Object.getPrototypeOf(val).toString() === '/(?:)/') {
    return true
  }

  return false
}

function wrapQueryResponse (results, params) {
  let response = query(results, params).sort((a, b) => a.index - b.index)

  assign(response, {
    query (params) {
      return wrapQueryResponse(response, params)
    },
    get markdown () {
      return flatten(response.map(node => node.lines.raw)).join('\n')
    },
    get raw () {
      return flatten(response.map(node => node.lines.raw))
    },
    get text () {
      return response.map(node => extractText(node))
    },
    get first() {
      return response[0]
    },
    get last(){
      return response[ response.length - 1 ]
    }
  })

  return response.sort((a,b) => a.index - b.index)
}

function nextSibling (node, nodes, depthsIndex, idsIndex) {
  let myIndex = depthsIndex[node.depth].indexOf(node.index)
  let nextIndex = depthsIndex[node.depth][myIndex + 1]
  if (nextIndex && nodes[nextIndex]) {
    return nodes[nextIndex]
  }
}

function previousSibling (node, nodes, depthsIndex, idsIndex) {
  let myIndex = depthsIndex[node.depth].indexOf(node.index)
  let nextIndex = depthsIndex[node.depth][myIndex - 1]
  if (nextIndex > 0 && nextIndex && nodes[nextIndex]) {
    return nodes[nextIndex]
  }
}

function allChildren (node, nodes, ids, childrenIndexes) {
  let indexes = childrenIndexes[node.id]

  if (!indexes) { return [] }

  let results = indexes.map(i => nodes[i])

  return results.reduce((memo, child, index) => {
    if (child.type === 'heading') {
      memo.push(child)
      memo = memo.concat(allChildren(child, nodes, ids, childrenIndexes).sort((a,b)=>parseInt(a.index)-parseInt(b.index)))
    } else {
      memo.push(child)
    }
    return memo
  }, []).sort((a,b) => parseInt(a.index) - parseInt(b.index))
}

function firstTypeInterface (node) {
  let obj = {}

  node.descendants.forEach(descendant => {
    if (!obj[descendant.type]) {
      Object.defineProperty(obj, descendant.type, {
        enumerable: false,
        get: function () { return descendant }
      })
    }
  })

  return obj
}

function applyToNode (node, options = {}) {
  let { nodes, document } = options
  let { ids, types, depths, childrenIndexes } = document.indexes

  lazy(node, 'parent', (() => nodes[ ids[node.parentId] ] ), false)

  hide.getter(node, 'document', (() => document))

  lazy(node, 'lines', function () {
    return {
      start: node.position.start.line,
      end: node.position.end.line,
      get raw () {
        let start = node.position.start.line
        let end = node.position.end.line
        return document.lines.slice(start - 1, end)
      }
    }
  }, false)

  if (node.type === 'heading') {
    hide.property(node, 'siblings', {})

    // node.siblings.next
    lazy(node.siblings, 'next', (() => nextSibling(node, nodes, depths, ids) ), false)

    // node.siblings.previous
    lazy(node.siblings, 'previous', (() => previousSibling(node, nodes, depths, ids) ), false)

    lazy(node, 'descendants', (function () {
      return allChildren(node, nodes, ids, childrenIndexes)
    }), false)

    lazy(node, 'childHeadings', (function () {
      return query(node.descendants, {type:'heading', depth: node.depth + 1})
    }))

    lazy(node, 'paragraphs', (function () {
      return query(nodes, {type:'paragraph', parentId: node.id})
    }))

    lazy(node, 'codeBlocks', (function () {
      return query(nodes, {type:'code', parentId: node.id})
    }))

    lazy(node, 'first', (function () {
      return firstTypeInterface(node)
    }), false)

    assign(node, {
      query (...rest) {
        return query(node.descendants, ...rest)
      }
    })
  }

}

