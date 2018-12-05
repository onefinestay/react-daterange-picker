'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMomentRange;

var _momentRange = require('../moment-range');

var _momentRange2 = _interopRequireDefault(_momentRange);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isMomentRange(val) {
  return val && val.start && val.end && _momentRange2.default.isMoment(val.start) && _momentRange2.default.isMoment(val.end);
}