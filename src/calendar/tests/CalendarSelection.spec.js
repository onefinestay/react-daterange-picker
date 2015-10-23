import React from 'react';
import TestUtils from 'react-addons-test-utils';
import CalendarSelection from '../CalendarSelection';


describe('The CalendarSelection Component', function () {
  beforeEach(function () {
    this.spyCx = spyOn(CalendarSelection.prototype.__reactAutoBindMap, 'cx').and.returnValue('my-class');

    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<CalendarSelection pending={true} modifier='test'/>);
    this.renderedComponent = shallowRenderer.getRenderOutput();
  });

  it('should render the right element', function () {
    expect(this.renderedComponent.type).toBe('div');
    expect(this.spyCx).toHaveBeenCalledWith({
      states: {
        pending: true,
      },
      modifiers: {
        test: true,
      },
    });
    expect(this.renderedComponent.props.className).toEqual('my-class');
  });
});
