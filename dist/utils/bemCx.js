'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = bemCx;

function bemCx() {
  var options = arguments[0] === undefined ? {} : arguments[0];
  var block = options.block;
  var element = options.element;
  var namespace = options.namespace;
  var modifiers = options.modifiers;
  var states = options.states;

  var bemClasses = [];
  var baseClassName = undefined;

  if (element) {
    if (namespace) {
      baseClassName = '' + namespace + '-' + block + '__' + element;
    } else {
      baseClassName = '' + block + '__' + element;
    }
  } else {
    if (namespace) {
      baseClassName = '' + namespace + '-' + block;
    } else {
      baseClassName = block;
    }
  }

  bemClasses.push(baseClassName);

  if (states) {
    if (typeof states == 'object') {
      states = Object.keys(states).filter(function (s) {
        return states[s];
      });
    }

    states.forEach(function (state) {
      bemClasses.push('' + baseClassName + '--is-' + state);
    });
  }

  if (modifiers) {
    if (typeof modifiers == 'object') {
      modifiers = Object.keys(modifiers).filter(function (m) {
        return modifiers[m];
      });
    }

    modifiers.forEach(function (modifier) {
      bemClasses.push('' + baseClassName + '--' + modifier);

      if (states) {
        states.forEach(function (state) {
          bemClasses.push('' + baseClassName + '--' + modifier + '--is-' + state);
        });
      }
    });
  }

  return bemClasses.join(' ');
}

module.exports = exports['default'];