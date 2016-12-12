'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMomentRange;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment-range');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isMomentRange(val) {
  return val && val.start && val.end && _moment2.default.isMoment(val.start) && _moment2.default.isMoment(val.end);
}