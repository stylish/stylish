'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

/**
 * Provides a layer on top of React's PropTypes. This allows our code to be
 * self-documenting, while maintaining prop type checking.
 */

var Types = null; /*
                   * Copyright (c) 2016-present, Parse, LLC
                   * All rights reserved.
                   *
                   * This source code is licensed under the license found in the LICENSE file in
                   * the root directory of this source tree.
                   */

function wrapType(type, id) {
  type._id = id;
  if (type.isRequired) {
    type.isRequired = wrapType(type.isRequired, id);
    type.isRequired._required = true;
    type.isRequired._classes = type._classes;
    type.isRequired._values = type._values;
  }
  type.describe = function (description) {
    var wrapped = function wrapped() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return type.apply(type, args);
    };
    wrapped._id = type._id;
    wrapped._required = type._required;
    wrapped._description = description;
    wrapped._values = type._values;
    wrapped._classes = type._classes;
    return wrapped;
  };

  return type;
}

Types = {
  array: wrapType(_react.PropTypes.array, 'Array'),
  bool: wrapType(_react.PropTypes.bool, 'Boolean'),
  func: wrapType(_react.PropTypes.func, 'Function'),
  number: wrapType(_react.PropTypes.number, 'Number'),
  object: wrapType(_react.PropTypes.object, 'Object'),
  string: wrapType(_react.PropTypes.string, 'String'),

  node: wrapType(_react.PropTypes.node, 'Node'),

  element: wrapType(_react.PropTypes.element, 'Element'),

  any: wrapType(_react.PropTypes.any, 'Any'),

  instanceOf: function instanceOf(klass) {
    var name = klass.constructor.name;
    if (klass === Date) {
      name = 'Date';
    }
    return wrapType(_react.PropTypes.instanceOf(klass), name);
  },

  oneOf: function oneOf(values) {
    var type = _react.PropTypes.oneOf(values);
    type._values = values;
    type = wrapType(type, 'Enum');
    return type;
  },

  oneOfType: function oneOfType(classes) {
    var type = _react.PropTypes.oneOfType(classes);
    type._classes = classes;
    type = wrapType(type, 'Union');
    return type;
  },

  arrayOf: function arrayOf(valueType) {
    return wrapType(_react.PropTypes.arrayOf(valueType), 'Array<' + valueType._id + '>');
  },

  objectOf: function objectOf(valueType) {
    return wrapType(_react.PropTypes.objectOf(valueType), 'Object<String, ' + valueType._id + '>');
  },

  shape: function shape(_shape) {
    return wrapType(_react.PropTypes.shape(_shape), 'Object');
  }
};

exports.default = Types;