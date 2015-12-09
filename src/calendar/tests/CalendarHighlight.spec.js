import React from 'react';
import TestUtils from 'react-addons-test-utils';
import CalendarHighlight from '../CalendarHighlight';


describe('The CalendarHighlight Component', function () {
  beforeEach(function () {
    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<CalendarHighlight pending={true} modifier='test'/>);
    this.renderedComponent = shallowRenderer.getRenderOutput();
  });

  it('should render the right element', function () {
    expect(this.renderedComponent.type).toBe('div');
    expect(this.renderedComponent.props.className).toEqual('null__CalendarHighlight null__CalendarHighlight--test');
  });
});
