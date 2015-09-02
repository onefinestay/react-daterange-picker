import React from 'react/addons';

import BemMixin from '../BemMixin.js';

describe('BemMixin', function () {

  beforeEach(() => {
    this.types = {
      bemNamespace: React.PropTypes.string,
      bemBlock: React.PropTypes.string,
    };
    BemMixin.props = {};
    BemMixin.context = {};
    BemMixin.constructor = {};
  });

  it('defines a propTypes object', () => {
    expect(BemMixin.propTypes).toEqual(this.types);
  });

  it('defines a contextTypes object', () => {
    expect(BemMixin.contextTypes).toEqual(this.types);
  });

  it('defines a childContextTypes object', () => {
    expect(BemMixin.childContextTypes).toEqual(this.types);
  });

  it('#getChildContext returns the bem namespace and block', () => {
    spyOn(BemMixin, 'getChildContext').and.returnValue({
      bemNamespace: 'ns',
      bemBlock: 'block',
    });
    expect(BemMixin.getChildContext()).toEqual({
      bemNamespace: 'ns',
      bemBlock: 'block',
    });

  });

  describe('#getBemNamespace', () => {

    it('returns the props bem namespace if available', () => {
      BemMixin.props = {
        bemNamespace: 'ns-props',
      };
      BemMixin.context = {
        bemNamespace: 'ns-context',
      };
      expect(BemMixin.getBemNamespace()).toBe('ns-props');
    });

    it('returns the context bem namespace if available and if the props bem namespace is not available', () => {
      BemMixin.context = {
        bemNamespace: 'ns-context',
      };
      expect(BemMixin.getBemNamespace()).toBe('ns-context');
    });

    it('returns null otherwise', () => {
      expect(BemMixin.getBemNamespace()).toBe(null);
    });

  });

  describe('#getBemBlock', () => {

    it('returns the props bem block if available', () => {
      BemMixin.props = {
        bemBlock: 'block-props',
      };
      BemMixin.context = {
        bemBlock: 'block-context',
      };
      expect(BemMixin.getBemBlock()).toBe('block-props');
    });

    it('returns the context bem block if available and if the props bem block is not available', () => {
      BemMixin.context = {
        bemBlock: 'block-context',
      };
      expect(BemMixin.getBemBlock()).toBe('block-context');
    });

    it('returns null otherwise', () => {
      expect(BemMixin.getBemBlock()).toBe(null);
    });

  });

  describe('#cx generates the expected class names', () => {

    beforeEach(() => {
      spyOn(BemMixin, 'getBemNamespace').and.returnValue('ns');
      spyOn(BemMixin, 'getBemBlock').and.returnValue('block');
      BemMixin.constructor.displayName = 'elem';
    });

    it('using default values if no values are provided', () => {
      expect(BemMixin.cx()).toBe('ns-block__elem');
    });

    it('adds options when passed in', () => {
      expect(BemMixin.cx({modifiers: {mod: true}})).toBe('ns-block__elem ns-block__elem--mod');
    });

  });

});
