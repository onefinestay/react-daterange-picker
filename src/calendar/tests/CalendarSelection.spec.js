import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import CalendarSelection from '../CalendarSelection';


describe('The CalendarSelection Component', function () {
  beforeEach(function () {
    var shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(<CalendarSelection pending={true} modifier='test' bemBlock='DateRangePicker' />);
    this.renderedComponent = shallowRenderer.getRenderOutput();
  });

  it('should render the right element', function () {
    expect(this.renderedComponent.type).toBe('div');
    expect(this.renderedComponent.props.className).toContain('DateRangePicker__CalendarSelection');
  });
});
