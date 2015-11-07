import React from 'react';
import TestUtils from 'react-addons-test-utils';
import CalendarHighlight from '../CalendarHighlight';


describe('The CalendarHighlight Component', function () {
  beforeEach(function () {
    this.spyCx = spyOn(CalendarHighlight.prototype.__reactAutoBindMap, 'cx').and.returnValue('my-class');

    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<CalendarHighlight pending={true} modifier='test'/>);
    this.renderedComponent = shallowRenderer.getRenderOutput();
  });

  it('should render the right element', function () {
    expect(this.renderedComponent.type).toBe('div');
    expect(this.spyCx).toHaveBeenCalledWith({
      states: {
      },
      modifiers: {
        test: true,
      },
    });
    expect(this.renderedComponent.props.className).toEqual('my-class');
  });
});
