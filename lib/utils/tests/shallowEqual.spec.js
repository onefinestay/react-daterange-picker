'use strict';

var _shallowEqual = require('../shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment-range');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('shallowEqual', function () {

  it('returns true if provided with the same object', function () {
    var obj = { a: 'A' };
    expect((0, _shallowEqual2.default)(obj, obj)).toBe(true);
  });

  it('returns false if a key is in objA but not objB', function () {
    var objA = { a: 'A' };
    var objB = {};
    expect((0, _shallowEqual2.default)(objA, objB)).toBe(false);
  });

  it('returns false if a key is in objB but not objA', function () {
    var objA = {};
    var objB = { b: 'B' };
    expect((0, _shallowEqual2.default)(objA, objB)).toBe(false);
  });

  it('returns false if a key matches to a moment object with different day values in objA and objB', function () {
    var objA = { a: (0, _moment2.default)() };
    var objB = { a: (0, _moment2.default)().add(2, 'days') };
    expect((0, _shallowEqual2.default)(objA, objB)).toBe(false);
  });

  it('returns false if a key matches to a different moment range objects within objA and objB', function () {
    var start = new Date(2012, 0, 15);
    var end1 = new Date(2012, 4, 23);
    var end2 = new Date(2012, 4, 24);
    var range1 = _moment2.default.range(start, end1);
    var range2 = _moment2.default.range(start, end2);
    var objA = { a: range1 };
    var objB = { a: range2 };
    expect((0, _shallowEqual2.default)(objA, objB)).toBe(false);
  });

  it('returns false if a key matches to a non moment or moment range object and the values are different in objA and objB', function () {
    var objA = { a: {} };
    var objB = { a: {} };
    expect((0, _shallowEqual2.default)(objA, objB)).toBe(false);
  });

  it('returns true otherwise', function () {
    var start = new Date(2012, 0, 15);
    var end = new Date(2012, 4, 23);
    var range1 = _moment2.default.range(start, end);
    var range2 = _moment2.default.range(start, end);
    var obj = {};
    var objA = {
      a: (0, _moment2.default)(),
      b: range1,
      c: obj,
      d: 'a'
    };
    var objB = {
      a: (0, _moment2.default)(),
      b: range2,
      c: obj,
      d: 'a'
    };
    expect((0, _shallowEqual2.default)(objA, objB)).toBe(true);
  });
});