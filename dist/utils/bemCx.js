'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = bemCx;
function bemCx() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var block = options.block,
      element = options.element,
      namespace = options.namespace,
      modifiers = options.modifiers,
      states = options.states;

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
    if ((typeof states === 'undefined' ? 'undefined' : _typeof(states)) === 'object') {
      states = Object.keys(states).filter(function (s) {
        return states[s];
      });
    }

    states.forEach(function (state) {
      bemClasses.push(baseClassName + '--is-' + state);
    });
  }

  if (modifiers) {
    if ((typeof modifiers === 'undefined' ? 'undefined' : _typeof(modifiers)) === 'object') {
      modifiers = Object.keys(modifiers).filter(function (m) {
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