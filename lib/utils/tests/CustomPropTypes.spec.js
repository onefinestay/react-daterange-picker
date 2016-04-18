'use strict';

var _CustomPropTypes = require('../CustomPropTypes');

var _CustomPropTypes2 = _interopRequireDefault(_CustomPropTypes);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment-range');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('CustomPropTypes', function () {

  beforeEach(function () {
    this.props = {
      'att-string': 'val1',
      'att-moment': (0, _moment2.default)(),
      'att-moment-range': _moment2.default.range()
    };
  });

  describe('#momentOrMomentRange', function () {

    it('returns null if no property matches the property name', function () {
      expect(_CustomPropTypes2.default.momentOrMomentRange(this.props, 'att-nothing')).toBe(null);
    });

    it('returns null if the property is a moment', function () {
      expect(_CustomPropTypes2.default.momentOrMomentRange(this.props, 'att-moment')).toBe(null);
    });

    it('returns null if the property is a moment range', function () {
      expect(_CustomPropTypes2.default.momentOrMomentRange(this.props, 'att-moment-range')).toBe(null);
    });

    it('throws an error otherwise', function () {
      expect(_CustomPropTypes2.default.momentOrMomentRange(this.props, 'att-string')).toEqual(new Error('\'att-string\' must be a moment or a moment range'));
    });
  });

  describe('#moment', function () {

    it('returns null if no property matches the property name', function () {
      expect(_CustomPropTypes2.default.moment(this.props, 'att-nothing')).toBe(null);
    });

    it('returns null if the property is a moment', function () {
      expect(_CustomPropTypes2.default.moment(this.props, 'att-moment')).toBe(null);
    });

    it('throws an error otherwise', function () {
      expect(_CustomPropTypes2.default.moment(this.props, 'att-moment-range')).toEqual(new Error('\'att-moment-range\' must be a moment'));
      expect(_CustomPropTypes2.default.moment(this.props, 'att-string')).toEqual(new Error('\'att-string\' must be a moment'));
    });
  });

  describe('#momentRange', function () {

    it('returns null if no property matches the property name', function () {
      expect(_CustomPropTypes2.default.momentRange(this.props, 'att-nothing')).toBe(null);
    });

    it('returns null if the property is a moment range', function () {
      expect(_CustomPropTypes2.default.momentRange(this.props, 'att-moment-range')).toBe(null);
    });

    it('throws an error otherwise', function () {
      expect(_CustomPropTypes2.default.momentRange(this.props, 'att-moment')).toEqual(new Error('\'att-moment\' must be a moment range'));
      expect(_CustomPropTypes2.default.momentRange(this.props, 'att-string')).toEqual(new Error('\'att-string\' must be a moment range'));
    });
  });
});