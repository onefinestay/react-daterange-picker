import React from 'react';
import TestUtils from 'react-addons-test-utils';
import CalendarSelection from '../CalendarSelection';


describe('The CalendarSelection Component', function () {
  beforeEach(function () {
    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<CalendarSelection pending={true} modifier='test' bemBlock='DateRangePicker' />);
    this.renderedComponent = shallowRenderer.getRenderOutput();
  });

  it('should render the right element', function () {
    expect(this.renderedComponent.type).toBe('div');
    expect(this.renderedComponent.props.className).toContain('DateRangePicker__CalendarSelection');
  });
});
