'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _CalendarSelection = require('../CalendarSelection');

var _CalendarSelection2 = _interopRequireDefault(_CalendarSelection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('The CalendarSelection Component', function () {
  beforeEach(function () {
    var shallowRenderer = _reactAddonsTestUtils2.default.createRenderer();
    shallowRenderer.render(_react2.default.createElement(_CalendarSelection2.default, { pending: true, modifier: 'test', bemBlock: 'DateRangePicker' }));
    this.renderedComponent = shallowRenderer.getRenderOutput();
  });

  it('should render the right element', function () {
    expect(this.renderedComponent.type).toBe('div');
    expect(this.renderedComponent.props.className).toContain('DateRangePicker__CalendarSelection');
  });
});