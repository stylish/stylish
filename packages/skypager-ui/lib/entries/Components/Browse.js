'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BrowseComponents = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _jsxFileName = 'src/entries/Components/Browse.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stateful = require('ui/util/stateful');

var _stateful2 = _interopRequireDefault(_stateful);

var _reactRouter = require('react-router');

var _DashboardHeader = require('components/DashboardHeader');

var _DashboardHeader2 = _interopRequireDefault(_DashboardHeader);

var _DataTable = require('components/DataTable');

var _DataTable2 = _interopRequireDefault(_DataTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var categoryFolder = 'components';

var BrowseComponents = exports.BrowseComponents = (function (_Component) {
  (0, _inherits3.default)(BrowseComponents, _Component);

  function BrowseComponents() {
    (0, _classCallCheck3.default)(this, BrowseComponents);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(BrowseComponents).apply(this, arguments));
  }

  (0, _createClass3.default)(BrowseComponents, [{
    key: 'render',
    value: function render() {
      var copy = this.props.copy;

      return _react2.default.createElement(_DataTable2.default, { columns: columns, records: this.componentRecords, __source: {
          fileName: _jsxFileName,
          lineNumber: 58
        }
      });
    }
  }, {
    key: 'components',
    get: function get() {
      var project = this.context.project;
      var _props = this.props;
      var filters = _props.filters;
      var copy = _props.copy;

      return project.scripts.query((0, _extends3.default)({}, filters, { categoryFolder: categoryFolder }));
    }
  }, {
    key: 'componentRecords',
    get: function get() {
      var docs = this.context.project.content.documents;
      var data = this.context.project.content.data_sources;

      return this.components.map(function (component) {
        var api = data[component.id + '/interface'];
        var doc = docs['' + component.id];

        component.docs = doc || {};
        component.api = api && api.data || {};

        return component;
      }).map(function (component, index) {
        return (0, _extends3.default)({}, component, {
          index: index,
          title: component.docs.title || component.id.split('/').pop(),
          description: component.api.description || component.docs.mainCopy || ' ',
          link: _react2.default.createElement(
            _reactRouter.Link,
            { to: '/components/details/' + component.id, __source: {
                fileName: _jsxFileName,
                lineNumber: 50
              }
            },
            'View'
          )
        });
      });
    }
  }]);
  return BrowseComponents;
})(_react.Component);

BrowseComponents.displayName = 'BrowseComponents';
BrowseComponents.propTypes = {
  filters: _react.PropTypes.shape({
    categoryFolder: _react.PropTypes.string
  })
};
BrowseComponents.defaultProps = {
  filters: {}
};
exports.default = (0, _stateful2.default)(BrowseComponents, 'settings', 'components.filters', 'copy');

var columns = [{
  label: 'Title',
  field: 'title'
}, {
  label: 'Description',
  field: 'description'
}, {
  label: ' ',
  field: 'link'
}];