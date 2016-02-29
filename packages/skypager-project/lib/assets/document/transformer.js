'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformer(ast, doc) {
	var nodes = ast.children;

	var mainNode = {
		type: 'unknown',
		children: [],
		id: doc.slug,
		data: {
			htmlName: 'main',
			htmlAttributes: { id: doc.slug, 'class': 'skypager-document ' + (doc.groupName || '') }
		}
	};

	var depthIndexes = doc.indexes.depths;
	var present = (0, _keys2.default)(depthIndexes).filter(function (d) {
		return d >= 2 && depthIndexes[d].length > 0;
	}).sort();

	var containers = (0, _defineProperty3.default)({}, doc.slug, mainNode);

	present.forEach(function (level) {
		var headingIndexes = depthIndexes[level];

		headingIndexes.forEach(function (hIndex) {
			try {
				var heading = doc.nodes.at.index(hIndex);
				nodes[hIndex] = containers[heading.id] = makeContainerNode(heading);
			} catch (error) {
				console.log('error building container node', error.message, doc.paths.absolute);
			}
		});
	});

	nodes.forEach(function (node) {
		var parentContainer = containers[node.parentId] || mainNode;

		if (!node.data) {
			node.data = {};
		}
		if (!node.data.htmlAttributes) {
			node.data.htmlAttributes = {};
		}

		(0, _assign2.default)(node.data.htmlAttributes, {
			'data-node-index': node.index
		});

		if (parentContainer) {
			parentContainer.children.push(node);
		} else {}
	});

	return {
		type: 'root',
		children: [mainNode]
	};
}

var CONTAINERS = {
	2: 'section',
	3: 'article',
	4: 'div',
	5: 'div',
	6: 'div'
};

function makeContainerNode(heading) {
	var htmlName = CONTAINERS[heading.depth];

	var htmlAttributes = {
		'class': ['depth-' + heading.depth],
		'id': heading.id
	};

	if (heading.depth === 2 || heading.depth === 3) {
		htmlAttributes.class.push(htmlName + 's');
	}

	htmlAttributes.class = htmlAttributes.class.join(' ');

	var rangeInfo = {};
	var descendants = heading.descendants || [];

	return (0, _assign2.default)({}, heading, {
		children: [heading],
		data: {
			htmlName: htmlName,
			htmlAttributes: htmlAttributes
		},
		type: htmlName || 'unknown'
	});
}

module.exports = transformer;