'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _util = require('../../util');

var _query_interface = require('./query_interface');

var queryInterface = _interopRequireWildcard(_query_interface);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

  var _children = _slicedToArray(children, 1);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hc3NldHMvZG9jdW1lbnQvaW5kZXhlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztJQUVZLGNBQWM7Ozs7QUFFMUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLEdBQUcsRUFBRSxRQUFRLEVBQUU7QUFDeEMsU0FBTyxhQUFhLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0NBQ3BDLENBQUE7O0FBRUQsU0FBUyxhQUFhLENBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRTtBQUNyQyxLQUFHLEdBQUcsVUFUQyxLQUFLLEVBU0EsR0FBRyxDQUFDLENBQUE7O0FBRWhCLE1BQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUE7QUFDeEIsTUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFBO0FBQ3BCLE1BQUksVUFBVSxHQUFHLENBQUMsQ0FBQTtBQUNsQixNQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFBOztBQUVqQyxRQWhCNkIsSUFBSSxDQWdCNUIsUUFBUSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFDLEVBQUUsRUFBRSxlQUFlLEVBQUMsRUFBRSxFQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7O0FBRTdGLFlBbEI0QyxNQUFNLEVBa0IzQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTs7QUFFN0UsTUFBSSxZQUFZLEdBQUcsRUFBRyxDQUFBOzswQkFFd0IsUUFBUSxDQUFDLE9BQU87TUFBeEQsS0FBSyxxQkFBTCxLQUFLO01BQUUsZUFBZSxxQkFBZixlQUFl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RTtBQUNYLFFBQUksS0FBSyxHQUFJO0FBQUUsYUFBTyxLQUFLLENBQUE7S0FBRTtHQUM5QixDQUFDLENBQUE7O0FBRUYsU0FBTyxJQUFJLENBQUE7Q0FDWiIsImZpbGUiOiJpbmRleGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2xvbmUsIGZsYXR0ZW4sIGxhenksIGhpZGUsIHNsdWdpZnksIGFzc2lnbiB9IGZyb20gJy4uLy4uL3V0aWwnXG5cbmltcG9ydCAqIGFzIHF1ZXJ5SW50ZXJmYWNlIGZyb20gJy4vcXVlcnlfaW50ZXJmYWNlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhc3QsIGRvY3VtZW50KSB7XG4gIHJldHVybiBpbmRleENoaWxkcmVuKGFzdCwgZG9jdW1lbnQpXG59XG5cbmZ1bmN0aW9uIGluZGV4Q2hpbGRyZW4gKGFzdCwgZG9jdW1lbnQpIHtcbiAgYXN0ID0gY2xvbmUoYXN0KVxuXG4gIGxldCBub2RlcyA9IGFzdC5jaGlsZHJlblxuICBsZXQgY3VycmVudERlcHRoID0gMVxuICBsZXQgY2hpbGRJbmRleCA9IDBcbiAgbGV0IGN1cnJlbnRQYXJlbnQgPSBkb2N1bWVudC5zbHVnXG5cbiAgaGlkZS5wcm9wZXJ0eShkb2N1bWVudCwgJ2luZGV4ZXMnLCB7aWRzOiB7fSwgZGVwdGhzOiB7fSwgdHlwZXM6e30sIGNoaWxkcmVuSW5kZXhlczp7fX0sIHRydWUpXG5cbiAgYXNzaWduKGRvY3VtZW50LmluZGV4ZXMuZGVwdGhzLCB7IDE6IFtdLCAyOiBbXSwgMzogW10sIDQ6IFtdLCA1OiBbXSwgNjogW10gfSlcblxuICBsZXQgZGVwdGhUcmFja2VyID0geyB9XG5cbiAgbGV0IHsgdHlwZXMsIGNoaWxkcmVuSW5kZXhlcywgaWRzLCBkZXB0aHMgfSA9IGRvY3VtZW50LmluZGV4ZXNcblxuICBub2Rlcy5mb3JFYWNoKChub2RlLCBpbmRleCkgPT4ge1xuICAgIC8vIG1hcCBkaWZmZXJlbnQgYXR0cmlidXRlcyBvZiBlYWNoIG5vZGUgdG8gdGhlaXIgaW5kZXhcbiAgICAvLyBzbyB3ZSBjYW4gZWFzaWx5IGZpbHRlciB0aGVtIGxhdGVyXG5cbiAgICBub2RlLmluZGV4ID0gaW5kZXhcblxuICAgIGluZGV4VHlwZSh0eXBlcywgbm9kZSlcblxuICAgIGlmIChub2RlLnR5cGUgPT09ICdoZWFkaW5nJykge1xuICAgICAgLy8gYXNzaWducyBhbiBpZCB0byB0aGUgbm9kZSBiYXNlZCBvbiBhIHNsdWdcbiAgICAgIHRhZ0hlYWRpbmcobm9kZSlcblxuICAgICAgLy8gZS5nLiBpZiB3ZSdyZSBhbiBoMyBhbmQgb3VyIHByZXZpb3VzIGhlYWRpbmcgd2FzIGFuIGgyXG4gICAgICBpZiAobm9kZS5kZXB0aCA+IGN1cnJlbnREZXB0aCkge1xuICAgICAgICBub2RlLnBhcmVudElkID0gY3VycmVudFBhcmVudFxuICAgICAgfVxuXG4gICAgICAvLyB1c2Ugb3VyIHByZXZpb3VzIHNpYmxpbmdzIHBhcmVudFxuICAgICAgaWYgKG5vZGUuZGVwdGggPD0gY3VycmVudERlcHRoICYmIGRlcHRoVHJhY2tlcltub2RlLmRlcHRoXSkge1xuICAgICAgICBub2RlLnBhcmVudElkID0gZGVwdGhUcmFja2VyW25vZGUuZGVwdGhdLnBhcmVudElkXG4gICAgICB9XG5cbiAgICAgIC8vIHN0b3JlIHRoZSBsYXN0IG9uZVxuICAgICAgZGVwdGhUcmFja2VyW25vZGUuZGVwdGhdID0gbm9kZVxuICAgICAgZGVwdGhzW25vZGUuZGVwdGhdLnB1c2goaW5kZXgpXG4gICAgICBjdXJyZW50RGVwdGggPSBub2RlLmRlcHRoXG4gICAgICBjdXJyZW50UGFyZW50ID0gbm9kZS5pZFxuICAgICAgY2hpbGRJbmRleCA9IDBcblxuICAgICAgLy8gdGhpcyB3aWxsIGFsbW9zdCBhbHdheXMgYmUgb25lIGJ1dCB3ZSBuZWVkIHRvIGtub3cgaWYgbm90XG4gICAgICBpZiAoIWRvY3VtZW50LnN0YXJ0RGVwdGggfHwgY3VycmVudERlcHRoIDwgZG9jdW1lbnQuc3RhcnREZXB0aCkge1xuICAgICAgICBkb2N1bWVudC5zdGFydERlcHRoID0gY3VycmVudERlcHRoXG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5kZXB0aCA9IGN1cnJlbnREZXB0aFxuICAgICAgbm9kZS5wYXJlbnRJZCA9IGN1cnJlbnRQYXJlbnRcbiAgICAgIG5vZGUuY2hpbGRJbmRleCA9IGNoaWxkSW5kZXgrK1xuICAgICAgbm9kZS5jaGlsZElkID0gW2FsaWFzKG5vZGUudHlwZSksIG5vZGUuZGVwdGgsIGNoaWxkSW5kZXhdLmpvaW4oJy0nKVxuICAgICAgbm9kZS5pZCA9IFtub2RlLnBhcmVudElkLCBub2RlLmNoaWxkSWRdLmpvaW4oJy0nKVxuICAgIH1cblxuICAgIGlmICghbm9kZS5wYXJlbnRJZCkge1xuICAgICAgbm9kZS5wYXJlbnRJZCA9IGRvY3VtZW50LnNsdWdcbiAgICB9XG5cbiAgICBpbmRleFBhcmVudChjaGlsZHJlbkluZGV4ZXMsIG5vZGUpXG5cbiAgICBpZHNbbm9kZS5pZF0gPSBpbmRleFxuICB9KVxuXG4gIG5vZGVzLmZvckVhY2gobm9kZSA9PiBxdWVyeUludGVyZmFjZS5hcHBseVRvTm9kZShub2RlLCB7ZG9jdW1lbnQsIG5vZGVzfSkpXG5cbiAgcmV0dXJuIGFzdFxufVxuXG5mdW5jdGlvbiBhbGlhcyAobm9kZVR5cGUpIHtcbiAgbGV0IGFsaWFzZXMgPSB7XG4gICAgJ3BhcmFncmFwaCc6ICdwJ1xuICB9XG5cbiAgcmV0dXJuIGFsaWFzZXNbbm9kZVR5cGVdID8gYWxpYXNlc1tub2RlVHlwZV0gOiBub2RlVHlwZVxufVxuXG5mdW5jdGlvbiBpbmRleFBhcmVudCAocGFyZW50cywgbm9kZSkge1xuICBpZiAoIXBhcmVudHNbbm9kZS5wYXJlbnRJZF0gfHwgIXBhcmVudHNbbm9kZS5wYXJlbnRJZF0ucHVzaCkge1xuICAgIHBhcmVudHNbbm9kZS5wYXJlbnRJZF0gPSBbXVxuICB9XG5cbiAgcGFyZW50c1tub2RlLnBhcmVudElkXS5wdXNoKG5vZGUuaW5kZXgpXG59XG5cbmZ1bmN0aW9uIGluZGV4VHlwZSAodHlwZXMsIG5vZGUpIHtcbiAgaWYgKCF0eXBlc1tub2RlLnR5cGVdIHx8ICF0eXBlc1tub2RlLnR5cGVdLnB1c2gpIHtcbiAgICB0eXBlc1tub2RlLnR5cGVdID0gW11cbiAgfVxuXG4gIHR5cGVzW25vZGUudHlwZV0ucHVzaChub2RlLmluZGV4KVxufVxuXG5mdW5jdGlvbiB0YWdIZWFkaW5nIChub2RlKSB7XG4gIGxldCB7Y2hpbGRyZW59ID0gbm9kZVxuICBsZXQgW3RleHRdID0gY2hpbGRyZW5cbiAgbGV0IHZhbHVlID0gdGV4dCAmJiB0ZXh0LnZhbHVlXG4gIGxldCBkYXRhID0gbm9kZS5kYXRhIHx8IChub2RlLmRhdGEgPSB7fSlcbiAgbGV0IGF0dHJzID0gZGF0YS5odG1sQXR0cmlidXRlcyA9IGRhdGEuaHRtbEF0dHJpYnV0ZXMgfHwgKGRhdGEuaHRtbEF0dHJpYnV0ZXMgPSB7fSlcblxuICBub2RlLmlkID0gYXR0cnMuaWQgPSBzbHVnaWZ5KHZhbHVlKVxuXG4gIGFzc2lnbihub2RlLCB7XG4gICAgZ2V0IHZhbHVlICgpIHsgcmV0dXJuIHZhbHVlIH1cbiAgfSlcblxuICByZXR1cm4gbm9kZVxufVxuXG4iXX0=