'use strict';

var _areMomentRangesEqual = require('../areMomentRangesEqual');

var _areMomentRangesEqual2 = _interopRequireDefault(_areMomentRangesEqual);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment-range');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('areMomentRangesEqual', function () {

  it('returns true if the two ranges start and finish on the same day', function () {
    var start = new Date(2012, 0, 15);
    var end = new Date(2012, 4, 23);
    var range1 = _moment2.default.range(start, end);
    var range2 = _moment2.default.range(start, end);
    expect((0, _areMomentRangesEqual2.default)(range1, range2)).toBe(true);
  });

  it('returns false if the two ranges start on the same day but finish on different days', function () {
    var start = new Date(2012, 0, 15);
    var end1 = new Date(2012, 4, 23);
    var end2 = new Date(2012, 4, 24);
    var range1 = _moment2.default.range(start, end1);
    var range2 = _moment2.default.range(start, end2);
    expect((0, _areMomentRangesEqual2.default)(range1, range2)).toBe(false);
  });

  it('returns false if the two ranges finish on the same day but start on different days', function () {
    var start1 = new Date(2012, 0, 15);
    var start2 = new Date(2012, 0, 16);
    var end = new Date(2012, 4, 23);
    var range1 = _moment2.default.range(start1, end);
    var range2 = _moment2.default.range(start2, end);
    expect((0, _areMomentRangesEqual2.default)(range1, range2)).toBe(false);
  });

  it('returns false if the two ranges start and finish on different days', function () {
    var start1 = new Date(2012, 0, 15);
    var start2 = new Date(2012, 0, 16);
    var end1 = new Date(2012, 4, 23);
    var end2 = new Date(2012, 4, 24);
    var range1 = _moment2.default.range(start1, end1);
    var range2 = _moment2.default.range(start2, end2);
    expect((0, _areMomentRangesEqual2.default)(range1, range2)).toBe(false);
  });
});