'use strict';

var _PureRenderMixin = require('../PureRenderMixin');

var _PureRenderMixin2 = _interopRequireDefault(_PureRenderMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('PureRenderMixin', function () {

  beforeEach(function () {
    _PureRenderMixin2.default.props = {
      a: 'A'
    };
    _PureRenderMixin2.default.state = {
      b: 'B'
    };
  });

  describe('#shouldComponentUpdate', function () {

    it('return true if the object props and the nextProps argument are different', function () {
      expect(_PureRenderMixin2.default.shouldComponentUpdate({ a: 'A-different' }, { b: 'B' })).toBe(true);
    });

    it('return true if the object state and the nextState argument are different', function () {
      expect(_PureRenderMixin2.default.shouldComponentUpdate({ a: 'A' }, { b: 'B-different' })).toBe(true);
    });

    it('return false otherwise', function () {
      expect(_PureRenderMixin2.default.shouldComponentUpdate({ a: 'A' }, { b: 'B' })).toBe(false);
    });
  });
});