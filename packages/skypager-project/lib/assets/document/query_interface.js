'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The Document Query Interface decorates the nodes in our Markdown AST with
 * helper methods which can be used to inspect the content, and query the document
 * to find child nodes, sibling nodes, and other information such as nested code blocks
 * with the language javascript, or anything else.
 */
module.exports = {
  nodes: function nodes(document, type) {
    var params = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    return buildFilterInterface(document);
  },
  code: function code(document) {
    var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return buildCodeInterface(document);
  },
  headings: function headings(document) {
    var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return buildHeadingsInterface(document);
  },
  applyToNode: function applyToNode() {
    return _applyToNode.apply(undefined, arguments);
  }
};

function extractHeadingText(node) {
  if ((typeof node === 'undefined' ? 'undefined' : (0, _typeof3.default)(node)) === 'object' && node.type === 'heading' && node.children) {
    return node.children[0].value;
  }
}

function buildHeadingsInterface(document, scope, titleDepth) {
  var headingNodes = scope ? scope : nodesByType.call(document, 'heading');

  titleDepth = titleDepth || document.startDepth || 1;

  return {
    section: function section(heading) {
      var relative = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var nodes = document.nodes.at.id((0, _util.slugify)(heading)).descendants;
      return buildHeadingsInterface(document, nodes);
    },

    /**
    * For specially named sections which have articles,
    * what are they called? this is a convenience method so
    * we can generate css class names to make them easily queryable
    */
    articleNameFor: function articleNameFor(sectionName) {
      if (document.modelDefinition && document.modelDefinition.sectionsConfig) {
        var cfg = document.modelDefinition.sectionsConfig[(0, _util.slugify)(sectionName)];

        if (cfg && cfg.config.articles) {
          return (0, _values2.default)(cfg.config.articles)[0];
        }
      }
    },

    get titles() {
      return wrapQueryResponse(_query(headingNodes, { depth: titleDepth }));
    },
    get sections() {
      return wrapQueryResponse(_query(headingNodes, { depth: titleDepth + 1 }));
    },
    get articles() {
      return wrapQueryResponse(_query(headingNodes, { depth: titleDepth + 2 }));
    },
    get minor() {
      var depths = [titleDepth + 3, titleDepth + 4, titleDepth + 5];
      return wrapQueryResponse(_query(headingNodes, { depth: depths }));
    }
  };
}

function buildCodeInterface(document) {
  var blocks = nodesByType.call(document, 'code');
  return wrapCodeBlocks.call(document, blocks);
}

function wrapCodeBlocks(codeBlocks) {
  var document = this;

  var i = {
    get languages() {
      return wrapQueryResponse(codeBlocks).pluck('lang').unique();
    },
    get all() {
      return wrapQueryResponse(codeBlocks);
    },

    get grouped() {
      return codeBlocks.reduce(function (memo, block) {
        (memo[block.lang] = memo[block.lang] || []).push(block);
        return memo;
      }, {});
    },

    under: function under(heading) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var results = document.nodes.at.id((0, _util.slugify)(heading)).descendants.filter(function (b) {
        return b.type === 'code';
      });
      return wrapQueryResponse(results, params);
    }
  };

  codeBlocks.map(function (block) {
    return block.lang;
  }).forEach(function (lang) {
    if (!i[lang]) {
      (0, _defineProperty2.default)(i, lang, {
        get: function get() {
          return wrapQueryResponse(codeBlocks, { lang: lang }) || [];
        }
      });
    }
  });

  return i;
}

function buildFilterInterface(document) {
  if (!document.indexes) {
    document.indexed;
  }

  var types = (0, _keys2.default)(document.indexes.types);

  var lines = document.indexes.lines;
  var ids = document.indexes.ids;

  var typeFilter = nodesByType.bind(document);

  var findById = function findById(id) {
    return document.indexed.children[ids[id]];
  };

  var i = {
    query: function query() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return _query(document.indexed.children, params);
    },
    under: function under(heading) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var results = document.nodes.at.id((0, _util.slugify)(heading)).descendants;
      return wrapQueryResponse(results, params);
    },
    including: function including(heading) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var headingNode = document.nodes.at.id((0, _util.slugify)(heading));
      var results = [headingNode].concat(document.nodes.at.id((0, _util.slugify)(heading)).descendants);

      return wrapQueryResponse(results, params);
    },
    type: typeFilter.bind(document),
    of: {
      type: typeFilter.bind(document)
    },
    at: (0, _util.assign)(findById, {
      line: function line(i) {
        return document.indexed.children[lines[i]];
      },
      index: function index(i) {
        return document.indexed.children[i];
      },
      id: findById
    })
  };

  // document.nodes.headings
  types.forEach(function (type) {
    (0, _defineProperty2.default)(i, type + 's', {
      enumerable: false,
      get: function get() {
        return typeFilter(type);
      }
    });
  });

  return i;
}

function nodesUnderHeading(heading, params) {
  var nodes = this.nodes.at.id((0, _util.slugify)(heading)).descendants;
  return wrapQueryResponse(node, params);
}

function nodesByType(type, params) {
  var nodes = this.indexed.children;
  var results = (this.indexes.types[type] || []).map(function (pointer) {
    return nodes[pointer];
  });
  return wrapQueryResponse(results, params);
}

function queryNodes() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var nodes = params.nodes || this.indexed.children;
  return wrapQueryResponse(nodes, params);
}

function _query(nodeList) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _util.filterQuery)(nodeList, params);
}

function extractText(node) {
  if (node.children && node.children[0]) {
    if (node.children[0] && node.children[0].type === 'text' && node.children[0].value) {
      return node.children[0].value;
    }
  }
}

function isRegex(val) {
  if ((typeof val === 'undefined' ? 'undefined' : (0, _typeof3.default)(val)) === 'object' && (0, _getPrototypeOf2.default)(val).toString() === '/(?:)/') {
    return true;
  }

  return false;
}

function wrapQueryResponse(results, params) {
  var response = _query(results, params).sort(function (a, b) {
    return a.index - b.index;
  });

  (0, _util.assign)(response, {
    query: function query(params) {
      return wrapQueryResponse(response, params);
    },

    get markdown() {
      return (0, _util.flatten)(response.map(function (node) {
        return node.lines && node.lines.raw;
      })).join('\n');
    },
    get raw() {
      return (0, _util.flatten)(response.map(function (node) {
        return node.lines && node.lines.raw;
      }));
    },
    get text() {
      return response.map(function (node) {
        return extractText(node);
      });
    },
    get first() {
      return response[0];
    },
    get last() {
      return response[response.length - 1];
    }
  });

  return response.sort(function (a, b) {
    return a.index - b.index;
  });
}

function nextSibling(node, nodes, depthsIndex, idsIndex) {
  var myIndex = depthsIndex[node.depth].indexOf(node.index);
  var nextIndex = depthsIndex[node.depth][myIndex + 1];
  if (nextIndex && nodes[nextIndex]) {
    return nodes[nextIndex];
  }
}

function previousSibling(node, nodes, depthsIndex, idsIndex) {
  var myIndex = depthsIndex[node.depth].indexOf(node.index);
  var nextIndex = depthsIndex[node.depth][myIndex - 1];
  if (nextIndex > 0 && nextIndex && nodes[nextIndex]) {
    return nodes[nextIndex];
  }
}

function allChildren(node, nodes, ids, childrenIndexes) {
  var indexes = childrenIndexes[node.id];

  if (!indexes) {
    return [];
  }

  var results = indexes.map(function (i) {
    return nodes[i];
  });

  return results.reduce(function (memo, child, index) {
    if (child.type === 'heading') {
      memo.push(child);
      memo = memo.concat(allChildren(child, nodes, ids, childrenIndexes).sort(function (a, b) {
        return parseInt(a.index) - parseInt(b.index);
      }));
    } else {
      memo.push(child);
    }
    return memo;
  }, []).sort(function (a, b) {
    return parseInt(a.index) - parseInt(b.index);
  });
}

function firstTypeInterface(node) {
  var obj = {};

  node.descendants.forEach(function (descendant) {
    if (!obj[descendant.type]) {
      (0, _defineProperty2.default)(obj, descendant.type, {
        enumerable: false,
        get: function get() {
          return descendant;
        }
      });
    }
  });

  return obj;
}

function _applyToNode(node) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var nodes = options.nodes;
  var document = options.document;
  var _document$indexes = document.indexes;
  var ids = _document$indexes.ids;
  var types = _document$indexes.types;
  var depths = _document$indexes.depths;
  var childrenIndexes = _document$indexes.childrenIndexes;

  (0, _util.lazy)(node, 'parent', function () {
    return nodes[ids[node.parentId]];
  }, false);

  _util.hide.getter(node, 'document', function () {
    return document;
  });

  (0, _util.lazy)(node, 'lines', function () {
    return {
      start: node.position.start.line,
      end: node.position.end.line,
      get raw() {
        var start = node.position.start.line;
        var end = node.position.end.line;
        return document.lines.slice(start - 1, end);
      }
    };
  }, false);

  if (node.type === 'heading') {
    _util.hide.property(node, 'siblings', {});

    // node.siblings.next
    (0, _util.lazy)(node.siblings, 'next', function () {
      return nextSibling(node, nodes, depths, ids);
    }, false);

    // node.siblings.previous
    (0, _util.lazy)(node.siblings, 'previous', function () {
      return previousSibling(node, nodes, depths, ids);
    }, false);

    (0, _util.lazy)(node, 'descendants', function () {
      return allChildren(node, nodes, ids, childrenIndexes);
    }, false);

    (0, _util.lazy)(node, 'childHeadings', function () {
      return _query(node.descendants, { type: 'heading', depth: node.depth + 1 });
    });

    (0, _util.lazy)(node, 'paragraphs', function () {
      return _query(nodes, { type: 'paragraph', parentId: node.id });
    });

    (0, _util.lazy)(node, 'codeBlocks', function () {
      return _query(nodes, { type: 'code', parentId: node.id });
    });

    (0, _util.lazy)(node, 'first', function () {
      return firstTypeInterface(node);
    }, false);

    (0, _util.assign)(node, {
      query: function query() {
        for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
          rest[_key] = arguments[_key];
        }

        return _query.apply(undefined, [node.descendants].concat((0, _toConsumableArray3.default)(rest)));
      }
    });
  }
}