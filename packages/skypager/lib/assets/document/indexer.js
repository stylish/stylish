'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _util = require('../../util');

var _query_interface = require('./query_interface');

var queryInterface = _interopRequireWildcard(_query_interface);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (ast, document) {
  return indexChildren(ast, document);
};

function indexChildren(ast, document) {
  ast = (0, _util.clone)(ast);

  var nodes = ast.children;
  var currentDepth = 1;
  var childIndex = 0;
  var currentParent = document.slug;

  _util.hide.property(document, 'indexes', { ids: {}, depths: {}, types: {}, childrenIndexes: {} }, true);

  (0, _util.assign)(document.indexes.depths, { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] });

  var depthTracker = {};

  var _document$indexes = document.indexes;
  var types = _document$indexes.types;
  var childrenIndexes = _document$indexes.childrenIndexes;
  var ids = _document$indexes.ids;
  var depths = _document$indexes.depths;

  nodes.forEach(function (node, index) {
    // map different attributes of each node to their index
    // so we can easily filter them later

    node.index = index;

    indexType(types, node);

    if (node.type === 'heading') {
      // assigns an id to the node based on a slug
      tagHeading(node);

      // e.g. if we're an h3 and our previous heading was an h2
      if (node.depth > currentDepth) {
        node.parentId = currentParent;
      }

      // use our previous siblings parent
      if (node.depth <= currentDepth && depthTracker[node.depth]) {
        node.parentId = depthTracker[node.depth].parentId;
      }

      // store the last one
      depthTracker[node.depth] = node;
      depths[node.depth].push(index);
      currentDepth = node.depth;
      currentParent = node.id;
      childIndex = 0;

      // this will almost always be one but we need to know if not
      if (!document.startDepth || currentDepth < document.startDepth) {
        document.startDepth = currentDepth;
      }
    } else {
      node.depth = currentDepth;
      node.parentId = currentParent;
      node.childIndex = childIndex++;
      node.childId = [alias(node.type), node.depth, childIndex].join('-');
      node.id = [node.parentId, node.childId].join('-');
    }

    if (!node.parentId) {
      node.parentId = document.slug;
    }

    indexParent(childrenIndexes, node);

    ids[node.id] = index;
  });

  nodes.forEach(function (node) {
    return queryInterface.applyToNode(node, { document: document, nodes: nodes });
  });

  return ast;
}

function alias(nodeType) {
  var aliases = {
    'paragraph': 'p'
  };

  return aliases[nodeType] ? aliases[nodeType] : nodeType;
}

function indexParent(parents, node) {
  if (!parents[node.parentId] || !parents[node.parentId].push) {
    parents[node.parentId] = [];
  }

  parents[node.parentId].push(node.index);
}

function indexType(types, node) {
  if (!types[node.type] || !types[node.type].push) {
    types[node.type] = [];
  }

  types[node.type].push(node.index);
}

function tagHeading(node) {
  var children = node.children;

  var _children = (0, _slicedToArray3.default)(children, 1);

  var text = _children[0];

  var value = text && text.value;
  var data = node.data || (node.data = {});
  var attrs = data.htmlAttributes = data.htmlAttributes || (data.htmlAttributes = {});

  node.id = attrs.id = (0, _util.slugify)(value);

  (0, _util.assign)(node, {
    get value() {
      return value;
    }
  });

  return node;
}