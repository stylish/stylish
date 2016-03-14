'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _jsxFileName = 'src/components/ProgressReport/index.js';
exports.ProgressReport = ProgressReport;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ProgressReport() {
	var report = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	var items = (0, _keys2.default)(report).map(function (item, i) {
		var width = parseInt(report[item]) + '%';
		return _react2.default.createElement(
			'li',
			{ className: 'list-group-item', key: i, __source: {
					fileName: _jsxFileName,
					lineNumber: 6
				}
			},
			item,
			_react2.default.createElement('span', { className: 'list-group-progress', style: { width: width }, __source: {
					fileName: _jsxFileName,
					lineNumber: 8
				}
			})
		);
	});

	return _react2.default.createElement(
		'ul',
		{ className: 'list-group', __source: {
				fileName: _jsxFileName,
				lineNumber: 12
			}
		},
		' ',
		items,
		' '
	);
}

exports.default = ProgressReport;