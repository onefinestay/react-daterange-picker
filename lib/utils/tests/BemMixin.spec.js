'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BemMixin = require('../BemMixin');

var _BemMixin2 = _interopRequireDefault(_BemMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('BemMixin', function () {

  beforeEach(function () {
    this.types = {
      bemNamespace: _react2.default.PropTypes.string,
      bemBlock: _react2.default.PropTypes.string
    };
    _BemMixin2.default.props = {};
    _BemMixin2.default.context = {};
    _BemMixin2.default.constructor = {};
  });

  it('defines a propTypes object', function () {
    expect(_BemMixin2.default.propTypes).toEqual(this.types);
  });

  it('defines a contextTypes object', function () {
    expect(_BemMixin2.default.contextTypes).toEqual(this.types);
  });

  it('defines a childContextTypes object', function () {
    expect(_BemMixin2.default.childContextTypes).toEqual(this.types);
  });

  it('#getChildContext returns the bem namespace and block', function () {
    spyOn(_BemMixin2.default, 'getChildContext').and.returnValue({
      bemNamespace: 'ns',
      bemBlock: 'block'
    });
    expect(_BemMixin2.default.getChildContext()).toEqual({
      bemNamespace: 'ns',
      bemBlock: 'block'
    });
  });

  describe('#getBemNamespace', function () {

    it('returns the props bem namespace if available', function () {
      _BemMixin2.default.props = {
        bemNamespace: 'ns-props'
      };
      _BemMixin2.default.context = {
        bemNamespace: 'ns-context'
      };
      expect(_BemMixin2.default.getBemNamespace()).toBe('ns-props');
    });

    it('returns the context bem namespace if available and if the props bem namespace is not available', function () {
      _BemMixin2.default.context = {
        bemNamespace: 'ns-context'
      };
      expect(_BemMixin2.default.getBemNamespace()).toBe('ns-context');
    });

    it('returns null otherwise', function () {
      expect(_BemMixin2.default.getBemNamespace()).toBe(null);
    });
  });

  describe('#getBemBlock', function () {

    it('returns the props bem block if available', function () {
      _BemMixin2.default.props = {
        bemBlock: 'block-props'
      };
      _BemMixin2.default.context = {
        bemBlock: 'block-context'
      };
      expect(_BemMixin2.default.getBemBlock()).toBe('block-props');
    });

    it('returns the context bem block if available and if the props bem block is not available', function () {
      _BemMixin2.default.context = {
        bemBlock: 'block-context'
      };
      expect(_BemMixin2.default.getBemBlock()).toBe('block-context');
    });

    it('returns null otherwise', function () {
      expect(_BemMixin2.default.getBemBlock()).toBe(null);
    });
  });

  describe('#cx generates the expected class names', function () {

    beforeEach(function () {
      spyOn(_BemMixin2.default, 'getBemNamespace').and.returnValue('ns');
      spyOn(_BemMixin2.default, 'getBemBlock').and.returnValue('block');
      _BemMixin2.default.constructor.displayName = 'elem';
    });

    it('using default values if no values are provided', function () {
      expect(_BemMixin2.default.cx()).toBe('ns-block__elem');
    });

    it('adds options when passed in', function () {
      expect(_BemMixin2.default.cx({ modifiers: { mod: true } })).toBe('ns-block__elem ns-block__elem--mod');
    });
  });
});