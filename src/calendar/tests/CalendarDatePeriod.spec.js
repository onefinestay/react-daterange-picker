import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import CalendarDatePeriod from '../CalendarDatePeriod';


describe('The CalendarDatePeriod Component', function () {
  beforeEach(function () {
    var shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(<CalendarDatePeriod period='month' color='pink' bemBlock='DateRangePicker' />);
    this.renderedComponent = shallowRenderer.getRenderOutput();
  });

  it('should render the right element', function () {
    expect(this.renderedComponent.type).toBe('div');
    expect(this.renderedComponent.props.className).toEqual('DateRangePicker__CalendarDatePeriod DateRangePicker__CalendarDatePeriod--month');
    expect(this.renderedComponent.props.style).toEqual({ backgroundColor: 'pink' });
  });
});
