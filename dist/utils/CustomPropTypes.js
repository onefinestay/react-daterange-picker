'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _moment2 = require('moment');

var _moment3 = _interopRequireDefault(_moment2);

require('moment-range');

var _isMomentRange = require('./isMomentRange');

var _isMomentRange2 = _interopRequireDefault(_isMomentRange);

exports['default'] = {
  momentOrMomentRange: function momentOrMomentRange(props, propName) {
    var val = props[propName];

    if (!val) {
      return null;
    } else if (_moment3['default'].isMoment(val)) {
      return null;
    } else if ((0, _isMomentRange2['default'])(val)) {
      return null;
    }
    return new Error('\'' + propName + '\' must be a moment or a moment range');
  },

  moment: function moment(props, propName) {
    var val = props[propName];

    if (!val) {
      return null;
    } else if (_moment3['default'].isMoment(val)) {
      return null;
    }
    return new Error('\'' + propName + '\' must be a moment');
  },

  momentRange: function momentRange(props, propName) {
    var val = props[propName];

    if (!val) {
      return null;
    } else if ((0, _isMomentRange2['default'])(val)) {
      return null;
    }
    return new Error('\'' + propName + '\' must be a moment range');
  },

  weekArray: function weekArray(props, propName) {
    var val = props[propName];
    if (!val) {
      return null;
    } else if (val.constructor === Array && val.length === 7) {
      return null;
    } else if (typeof val.count === 'function' && val.count() === 7) {
      return null;
    }
    return new Error(propName + '\' must be an array of 7 elements');
  }
};
module.exports = exports['default'];