'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _momentRange = require('moment-range');

var _momentRange2 = _interopRequireDefault(_momentRange);

var _isMomentRange = require('./isMomentRange');

var _isMomentRange2 = _interopRequireDefault(_isMomentRange);

exports['default'] = {
  momentOrMomentRange: function momentOrMomentRange(props, propName) {
    var val = props[propName];

    if (!val) {
      return null;
    } else if (_momentRange2['default'].isMoment(val)) {
      return null;
    } else if ((0, _isMomentRange2['default'])(val)) {
      return null;
    }
    return new Error('Value must be a moment or a moment range');
  },

  moment: function moment(props, propName) {
    var val = props[propName];

    if (!val) {
      return null;
    } else if (_momentRange2['default'].isMoment(val)) {
      return null;
    }
    return new Error('Value must be a moment');
  },

  momentRange: function momentRange(props, propName) {
    var val = props[propName];

    if (!val) {
      return null;
    } else if ((0, _isMomentRange2['default'])(val)) {
      return null;
    }
    return new Error('Value must be a moment range');
  } };
module.exports = exports['default'];