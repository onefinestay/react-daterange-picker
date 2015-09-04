import PureRenderMixin from '../PureRenderMixin.js';

describe('PureRenderMixin', () => {

  beforeEach(() => {
    PureRenderMixin.props = {
      a: 'A',
    };
    PureRenderMixin.state = {
      b: 'B',
    };
  });


  describe('#shouldComponentUpdate', () => {

    it('return true if the object props and the nextProps argument are different', () => {
      expect(PureRenderMixin.shouldComponentUpdate({a: 'A-different'}, {b: 'B'})).toBe(true);
    });

    it('return true if the object state and the nextState argument are different', () => {
      expect(PureRenderMixin.shouldComponentUpdate({a: 'A'}, {b: 'B-different'})).toBe(true);
    });

    it('return false otherwise', () => {
      expect(PureRenderMixin.shouldComponentUpdate({a: 'A'}, {b: 'B'})).toBe(false);
    });

  });

});
