'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ComponentDetails = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _jsxFileName = 'src/entries/Components/Details.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stateful = require('ui/util/stateful');

var _stateful2 = _interopRequireDefault(_stateful);

var _Row = require('react-bootstrap/lib/Row');

var _Row2 = _interopRequireDefault(_Row);

var _Col = require('react-bootstrap/lib/Col');

var _Col2 = _interopRequireDefault(_Col);

var _Grid = require('react-bootstrap/lib/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _CodeHighlighter = require('components/CodeHighlighter');

var _CodeHighlighter2 = _interopRequireDefault(_CodeHighlighter);

var _DataTable = require('components/DataTable');

var _DataTable2 = _interopRequireDefault(_DataTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ComponentDetails = exports.ComponentDetails = (function (_Component) {
  (0, _inherits3.default)(ComponentDetails, _Component);

  function ComponentDetails() {
    (0, _classCallCheck3.default)(this, ComponentDetails);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ComponentDetails).apply(this, arguments));
  }

  (0, _createClass3.default)(ComponentDetails, [{
    key: 'render',
    value: function render() {
      var _componentData = this.componentData;
      var title = _componentData.title;
      var description = _componentData.description;
      var componentProps = _componentData.componentProps;

      var docColumns = [{
        label: 'Property',
        field: 'key'
      }, {
        label: 'Data Type',
        field: 'value'
      }];

      return _react2.default.createElement(
        _Grid2.default,
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 49
          }
        },
        _react2.default.createElement(
          _Row2.default,
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 50
            }
          },
          _react2.default.createElement(
            'h2',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 51
              }
            },
            title
          ),
          _react2.default.createElement(
            'p',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 52
              }
            },
            description
          )
        ),
        _react2.default.createElement('hr', { className: 'm-b-md', __source: {
            fileName: _jsxFileName,
            lineNumber: 54
          }
        }),
        _react2.default.createElement(
          _Row2.default,
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 55
            }
          },
          _react2.default.createElement(
            _Col2.default,
            { xs: 6, __source: {
                fileName: _jsxFileName,
                lineNumber: 56
              }
            },
            _react2.default.createElement(
              'ul',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 57
                }
              },
              (0, _keys2.default)(componentProps).map(function (key) {
                var prop = componentProps[key];

                return _react2.default.createElement(
                  'li',
                  { key: key, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 62
                    }
                  },
                  _react2.default.createElement(
                    'strong',
                    { className: '', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 63
                      }
                    },
                    key
                  ),
                  _react2.default.createElement(
                    'span',
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 64
                      }
                    },
                    prop && prop.description
                  )
                );
              })
            )
          ),
          _react2.default.createElement(
            _Col2.default,
            { xs: 6, __source: {
                fileName: _jsxFileName,
                lineNumber: 70
              }
            },
            _react2.default.createElement(_CodeHighlighter2.default, { code: 'hello world', language: 'javascript', __source: {
                fileName: _jsxFileName,
                lineNumber: 71
              }
            })
          )
        )
      );
    }
  }, {
    key: 'componentData',
    get: function get() {
      var project = this.context.project;

      var id = this.props.params.splat;

      var script = project.scripts.query({ id: id, categoryFolder: 'components' })[0];
      var doc = project.docs['' + script.id];
      var apiDoc = project.data[script.id + '/interface'];
      var api = apiDoc && apiDoc.data || {};

      return (0, _extends3.default)({
        doc: doc,
        api: api
      }, script, {
        description: api.description,
        componentProps: api.props,
        title: api.displayName || doc.documentTitle,
        html: doc.html
      });
    }
  }]);
  return ComponentDetails;
})(_react.Component);

ComponentDetails.displayName = 'ComponentDetails';
ComponentDetails.propTypes = {};
exports.default = (0, _stateful2.default)(ComponentDetails);