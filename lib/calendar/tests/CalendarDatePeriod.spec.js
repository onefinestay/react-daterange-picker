'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _CalendarDatePeriod = require('../CalendarDatePeriod');

var _CalendarDatePeriod2 = _interopRequireDefault(_CalendarDatePeriod);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('The CalendarDatePeriod Component', function () {
  beforeEach(function () {
    var shallowRenderer = _reactAddonsTestUtils2.default.createRenderer();
    shallowRenderer.render(_react2.default.createElement(_CalendarDatePeriod2.default, { period: 'month', color: 'pink', bemBlock: 'DateRangePicker' }));
    this.renderedComponent = shallowRenderer.getRenderOutput();
  });

  it('should render the right element', function () {
    expect(this.renderedComponent.type).toBe('div');
    expect(this.renderedComponent.props.className).toEqual('DateRangePicker__CalendarDatePeriod DateRangePicker__CalendarDatePeriod--month');
    expect(this.renderedComponent.props.style).toEqual({ backgroundColor: 'pink' });
  });
});