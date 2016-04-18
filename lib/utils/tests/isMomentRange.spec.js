'use strict';

var _isMomentRange = require('../isMomentRange');

var _isMomentRange2 = _interopRequireDefault(_isMomentRange);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('isMomentRange', function () {

  it('returns false if no value is provided', function () {
    expect((0, _isMomentRange2.default)()).toBe(undefined);
  });

  it('returns false if there is no start value', function () {
    expect((0, _isMomentRange2.default)({ end: 'a' })).toBe(undefined);
  });

  it('returns false if there is no end value', function () {
    expect((0, _isMomentRange2.default)({ start: 'a' })).toBe(undefined);
  });

  it('returns false is the start value is not a moment value', function () {
    expect((0, _isMomentRange2.default)({ start: 'a', end: 'a' })).toBe(false);
  });

  it('returns false is the end value is not a moment value', function () {
    expect((0, _isMomentRange2.default)({ start: (0, _moment2.default)(), end: 'a' })).toBe(false);
  });

  it('return true otherwise', function () {
    expect((0, _isMomentRange2.default)({ start: (0, _moment2.default)(), end: (0, _moment2.default)() })).toBe(true);
  });
});