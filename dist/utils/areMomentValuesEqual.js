'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (previousValue, nextValue) {
  var areBothMoment = _moment2.default.isMoment(previousValue) && _moment2.default.isMoment(nextValue);
  if (!areBothMoment) {
    return false;
  }

  return previousValue.isSame(nextValue);
};

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment-range');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }