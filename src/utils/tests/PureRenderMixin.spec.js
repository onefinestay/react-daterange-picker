import PureRenderMixin from '../PureRenderMixin';

describe('PureRenderMixin', function () {

  beforeEach(function () {
    PureRenderMixin.props = {
      a: 'A',
    };
    PureRenderMixin.state = {
      b: 'B',
    };
  });


  describe('#shouldComponentUpdate', function () {

    it('return true if the object props and the nextProps argument are different', function () {
      expect(PureRenderMixin.shouldComponentUpdate({a: 'A-different'}, {b: 'B'})).toBe(true);
    });

    it('return true if the object state and the nextState argument are different', function () {
      expect(PureRenderMixin.shouldComponentUpdate({a: 'A'}, {b: 'B-different'})).toBe(true);
    });

    it('return false otherwise', function () {
      expect(PureRenderMixin.shouldComponentUpdate({a: 'A'}, {b: 'B'})).toBe(false);
    });

  });

});
