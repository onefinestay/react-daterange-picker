
import PropTypes from 'prop-types';
import BemMixin from '../BemMixin';

describe('BemMixin', function () {

  beforeEach(function () {
    this.types = {
      bemNamespace: PropTypes.string,
      bemBlock: PropTypes.string,
    };
    BemMixin.props = {};
    BemMixin.context = {};
    BemMixin.constructor = {};
  });

  it('defines a propTypes object', function () {
    expect(BemMixin.propTypes).toEqual(this.types);
  });

  it('defines a contextTypes object', function () {
    expect(BemMixin.contextTypes).toEqual(this.types);
  });

  it('defines a childContextTypes object', function () {
    expect(BemMixin.childContextTypes).toEqual(this.types);
  });

  it('#getChildContext returns the bem namespace and block', function() {
    spyOn(BemMixin, 'getChildContext').and.returnValue({
      bemNamespace: 'ns',
      bemBlock: 'block',
    });
    expect(BemMixin.getChildContext()).toEqual({
      bemNamespace: 'ns',
      bemBlock: 'block',
    });

  });

  describe('#getBemNamespace', function () {

    it('returns the props bem namespace if available', function () {
      BemMixin.props = {
        bemNamespace: 'ns-props',
      };
      BemMixin.context = {
        bemNamespace: 'ns-context',
      };
      expect(BemMixin.getBemNamespace()).toBe('ns-props');
    });

    it('returns the context bem namespace if available and if the props bem namespace is not available', function () {
      BemMixin.context = {
        bemNamespace: 'ns-context',
      };
      expect(BemMixin.getBemNamespace()).toBe('ns-context');
    });

    it('returns null otherwise', function () {
      expect(BemMixin.getBemNamespace()).toBe(null);
    });

  });

  describe('#getBemBlock', function () {

    it('returns the props bem block if available', function () {
      BemMixin.props = {
        bemBlock: 'block-props',
      };
      BemMixin.context = {
        bemBlock: 'block-context',
      };
      expect(BemMixin.getBemBlock()).toBe('block-props');
    });

    it('returns the context bem block if available and if the props bem block is not available', function () {
      BemMixin.context = {
        bemBlock: 'block-context',
      };
      expect(BemMixin.getBemBlock()).toBe('block-context');
    });

    it('returns null otherwise', function () {
      expect(BemMixin.getBemBlock()).toBe(null);
    });

  });

  describe('#cx generates the expected class names', function () {

    beforeEach(function () {
      spyOn(BemMixin, 'getBemNamespace').and.returnValue('ns');
      spyOn(BemMixin, 'getBemBlock').and.returnValue('block');
      BemMixin.constructor.displayName = 'elem';
    });

    it('using default values if no values are provided', function () {
      expect(BemMixin.cx()).toBe('ns-block__elem');
    });

    it('adds options when passed in', function () {
      expect(BemMixin.cx({modifiers: {mod: true}})).toBe('ns-block__elem ns-block__elem--mod');
    });

  });

});
