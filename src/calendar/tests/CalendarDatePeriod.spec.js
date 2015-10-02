import React from 'react/addons';
import CalendarDatePeriod from '../CalendarDatePeriod';

const TestUtils = React.addons.TestUtils;

describe('The CalendarDatePeriod Component', function () {
  beforeEach(function () {
    this.spyCx = spyOn(CalendarDatePeriod.prototype.__reactAutoBindMap, 'cx').and.returnValue('my-class');

    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<CalendarDatePeriod period='month' color='pink'/>);
    this.renderedComponent = shallowRenderer.getRenderOutput();
  });

  it('should render the right element', function () {
    expect(this.renderedComponent.type).toBe('div');
    expect(this.spyCx).toHaveBeenCalledWith({
      modifiers: {
        month: true,
      },
    });
    expect(this.renderedComponent.props.className).toEqual('my-class');
    expect(this.renderedComponent.props.style).toEqual({ backgroundColor: 'pink' });
  });
});
