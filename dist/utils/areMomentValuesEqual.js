'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (previousValue, nextValue) {
  var areBothMoment = _momentRange2.default.isMoment(previousValue) && _momentRange2.default.isMoment(nextValue);
  if (!areBothMoment) {
    return false;
  }

  return previousValue.isSame(nextValue);
};

var _momentRange = require('../moment-range');

var _momentRange2 = _interopRequireDefault(_momentRange);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }