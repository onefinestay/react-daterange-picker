'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _CalendarHighlight = require('../CalendarHighlight');

var _CalendarHighlight2 = _interopRequireDefault(_CalendarHighlight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('The CalendarHighlight Component', function () {
  beforeEach(function () {
    var shallowRenderer = _reactAddonsTestUtils2.default.createRenderer();
    shallowRenderer.render(_react2.default.createElement(_CalendarHighlight2.default, { pending: true, modifier: 'test', bemBlock: 'DateRangePicker' }));
    this.renderedComponent = shallowRenderer.getRenderOutput();
  });

  it('should render the right element', function () {
    expect(this.renderedComponent.type).toBe('div');
    expect(this.renderedComponent.props.className).toEqual('DateRangePicker__CalendarHighlight DateRangePicker__CalendarHighlight--test');
  });
});