'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = bemCx;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bemCx() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var block = options.block;
  var element = options.element;
  var namespace = options.namespace;
  var modifiers = options.modifiers;
  var states = options.states;

  var bemClasses = [];
  var baseClassName = void 0;

  if (element) {
    if (namespace) {
      baseClassName = namespace + '-' + block + '__' + element;
    } else {
      baseClassName = block + '__' + element;
    }
  } else {
    if (namespace) {
      baseClassName = namespace + '-' + block;
    } else {
      baseClassName = block;
    }
  }

  bemClasses.push(baseClassName);

  if (states) {
    if ((typeof states === 'undefined' ? 'undefined' : (0, _typeof3.default)(states)) === 'object') {
      states = (0, _keys2.default)(states).filter(function (s) {
        return states[s];
      });
    }

    states.forEach(function (state) {
      bemClasses.push(baseClassName + '--is-' + state);
    });
  }

  if (modifiers) {
    if ((typeof modifiers === 'undefined' ? 'undefined' : (0, _typeof3.default)(modifiers)) === 'object') {
      modifiers = (0, _keys2.default)(modifiers).filter(function (m) {
        return modifiers[m];
      });
    }

    modifiers.forEach(function (modifier) {
      bemClasses.push(baseClassName + '--' + modifier);

      if (states) {
        states.forEach(function (state) {
          bemClasses.push(baseClassName + '--' + modifier + '--is-' + state);
        });
      }
    });
  }

  return bemClasses.join(' ');
}