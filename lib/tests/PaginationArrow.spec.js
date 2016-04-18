'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _PaginationArrow = require('../PaginationArrow');

var _PaginationArrow2 = _interopRequireDefault(_PaginationArrow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('The Pagination Arrow component', function () {

  beforeEach(function () {
    var _this = this;

    var getPaginationArrow = function getPaginationArrow(props) {
      props = _lodash2.default.extend({
        disabled: false,
        onTrigger: function onTrigger() {},
        direction: 'next',
        bemBlock: 'DateRangePicker'
      }, props);
      return _react2.default.createElement(_PaginationArrow2.default, props);
    };

    this.useShallowRenderer = function (props) {
      _this.shallowRenderer = _reactAddonsTestUtils2.default.createRenderer();
      _this.shallowRenderer.render(getPaginationArrow(props));
      _this.renderedComponent = _this.shallowRenderer.getRenderOutput();
    };
  });

  it('creates the correct markup', function () {
    var clickTrigger = function clickTrigger() {};
    this.useShallowRenderer({
      onTrigger: clickTrigger
    });
    expect(this.renderedComponent).toEqual(_react2.default.createElement(
      'div',
      { bemBlock: 'DateRangePicker', className: 'DateRangePicker__PaginationArrow DateRangePicker__PaginationArrow--next', onClick: clickTrigger },
      _react2.default.createElement('div', { className: 'DateRangePicker__PaginationArrowIcon DateRangePicker__PaginationArrowIcon--next' })
    ));
  });
});