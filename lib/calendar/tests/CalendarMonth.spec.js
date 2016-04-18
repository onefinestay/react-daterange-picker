'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _CalendarMonth = require('../CalendarMonth');

var _CalendarMonth2 = _interopRequireDefault(_CalendarMonth);

var _CalendarDate = require('../CalendarDate');

var _CalendarDate2 = _interopRequireDefault(_CalendarDate);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment-range');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('The CalendarMonth Component', function () {

  beforeEach(function () {
    var _this = this;

    var getCalendarMonth = function getCalendarMonth(props) {

      props = _lodash2.default.extend({
        firstOfWeek: 0,
        firstOfMonth: _this.firstOfMonth,
        enabledRange: _moment2.default.range((0, _moment2.default)(), (0, _moment2.default)().add(3, 'years')),
        dateComponent: _CalendarDate2.default,
        disableNavigation: false,
        dateRangesForDate: function dateRangesForDate() {
          return {
            count: function count() {
              return props.count || 1;
            },
            getIn: function getIn(data) {
              if (data[0] === 0) {
                return '#333';
              }
              return '#444';
            }
          };
        },
        onMonthChange: function onMonthChange() {},
        onYearChange: function onYearChange() {},
        bemBlock: 'DateRangePicker'
      }, props);

      return _react2.default.createElement(_CalendarMonth2.default, props);
    };

    this.useShallowRenderer = function (props) {
      _this.shallowRenderer = _reactAddonsTestUtils2.default.createRenderer();
      _this.shallowRenderer.render(getCalendarMonth(props));
      _this.renderedComponent = _this.shallowRenderer.getRenderOutput();
      _this.container = _this.renderedComponent.props.children[0];
      _this.table = _this.renderedComponent.props.children[1];
    };

    this.useDocumentRenderer = function (props) {
      _this.component = _this.renderedComponent = _reactAddonsTestUtils2.default.renderIntoDocument(getCalendarMonth(props));
    };

    this.firstOfMonth = (0, _moment2.default)();
  });

  afterEach(function () {
    if (this.component) {
      _reactDom2.default.unmountComponentAtNode(_reactDom2.default.findDOMNode(this.component).parentNode);
    }
  });

  it('should render the right element', function () {
    this.useShallowRenderer();
    expect(this.renderedComponent.type).toBe('div');
    expect(this.renderedComponent.props.className).toEqual('DateRangePicker__Month');
  });

  describe('has a label acting as a header', function () {

    beforeEach(function () {
      this.useShallowRenderer();
    });

    it('which is a div with the correct class', function () {
      expect(this.container.type).toBe('div');
      expect(this.container.props.className).toEqual('DateRangePicker__MonthHeader');
    });

    describe('displaying month information', function () {

      it('which creates a span with the correct class', function () {

        this.useShallowRenderer();
        var span = this.container.props.children[0];

        expect(span.type).toBe('span');
        expect(span.props.className).toEqual('DateRangePicker__MonthHeaderLabel DateRangePicker__MonthHeaderLabel--month');
      });

      it('which displays the name of the month', function () {
        this.useShallowRenderer();
        var span = this.container.props.children[0];
        expect(span.props.children[0]).toBe(this.firstOfMonth.format('MMMM'));
      });

      it('which does not show navigation if props.disableNavigation is true', function () {
        this.useShallowRenderer({
          disableNavigation: true
        });
        var span = this.container.props.children[0];
        expect(span.props.children[1]).toBe(null);
      });

      it('which shows navigation if props.disableNavigation is false', function () {
        this.useShallowRenderer();
        var select = this.container.props.children[0].props.children[1];
        expect(select.type).toBe('select');
        expect(select.props.value).toBe(this.firstOfMonth.month());
        expect(select.props.className).toEqual('DateRangePicker__MonthHeaderSelect');
        expect(select.props.children.length).toBe(12);
      });

      it('which calls props.onMonthChange if props.disableNavigation is false and if the selected value changes', function () {
        var onMonthChange = jasmine.createSpy();
        this.useDocumentRenderer({
          onMonthChange: onMonthChange
        });
        var select = _reactDom2.default.findDOMNode(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(this.renderedComponent, 'select')[0]);
        select.value = '2';
        _reactAddonsTestUtils2.default.Simulate.change(select);
        expect(onMonthChange).toHaveBeenCalledWith(2);
      });
    });

    describe('displaying year information', function () {

      it('which creates a span with the correct class', function () {

        this.useShallowRenderer();
        var span = this.container.props.children[2];

        expect(span.type).toBe('span');
        expect(span.props.className).toEqual('DateRangePicker__MonthHeaderLabel DateRangePicker__MonthHeaderLabel--year');
      });

      it('which displays the name of the year', function () {
        this.useShallowRenderer();
        var span = this.container.props.children[2];
        expect(span.props.children[0]).toBe(this.firstOfMonth.format('YYYY'));
      });

      it('which does not show navigation if props.disableNavigation is true', function () {
        this.useShallowRenderer({
          disableNavigation: true
        });
        var span = this.container.props.children[2];
        expect(span.props.children[1]).toBe(null);
      });

      it('which shows navigation if props.disableNavigation is false', function () {
        this.useShallowRenderer();
        var select = this.container.props.children[2].props.children[1];
        expect(select.type).toBe('select');
        expect(select.props.value).toBe(this.firstOfMonth.year());
        expect(select.props.className).toEqual('DateRangePicker__MonthHeaderSelect');
        expect(select.props.children.length).toBe(15);
      });

      it('which calls props.onYearChange if props.disableNavigation is false and if the selected value changes', function () {
        var onYearChange = jasmine.createSpy();
        this.useDocumentRenderer({
          onYearChange: onYearChange
        });
        var select = _reactDom2.default.findDOMNode(_reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(this.renderedComponent, 'select')[1]);
        var value = (this.firstOfMonth.year() + 1).toString();
        select.value = value;
        _reactAddonsTestUtils2.default.Simulate.change(select);
        expect(onYearChange).toHaveBeenCalledWith(parseInt(value, 10));
      });
    });

    describe('has a table', function () {

      it('which has the expected className', function () {
        this.useShallowRenderer();
        expect(this.table.type).toBe('table');
        expect(this.table.props.className).toEqual('DateRangePicker__MonthDates');
      });

      it('whose head contains day information', function () {
        expect(this.table.props.children[0].props.children).toEqual(_react2.default.createElement(
          'tr',
          { className: 'DateRangePicker__Weekdays' },
          _react2.default.createElement(
            'th',
            { className: 'DateRangePicker__WeekdayHeading', key: 'Sunday,Sun', scope: 'col' },
            _react2.default.createElement(
              'abbr',
              { title: 'Sunday' },
              'Sun'
            )
          ),
          _react2.default.createElement(
            'th',
            { className: 'DateRangePicker__WeekdayHeading', key: 'Monday,Mon', scope: 'col' },
            _react2.default.createElement(
              'abbr',
              { title: 'Monday' },
              'Mon'
            )
          ),
          _react2.default.createElement(
            'th',
            { className: 'DateRangePicker__WeekdayHeading', key: 'Tuesday,Tue', scope: 'col' },
            _react2.default.createElement(
              'abbr',
              { title: 'Tuesday' },
              'Tue'
            )
          ),
          _react2.default.createElement(
            'th',
            { className: 'DateRangePicker__WeekdayHeading', key: 'Wednesday,Wed', scope: 'col' },
            _react2.default.createElement(
              'abbr',
              { title: 'Wednesday' },
              'Wed'
            )
          ),
          _react2.default.createElement(
            'th',
            { className: 'DateRangePicker__WeekdayHeading', key: 'Thursday,Thu', scope: 'col' },
            _react2.default.createElement(
              'abbr',
              { title: 'Thursday' },
              'Thu'
            )
          ),
          _react2.default.createElement(
            'th',
            { className: 'DateRangePicker__WeekdayHeading', key: 'Friday,Fri', scope: 'col' },
            _react2.default.createElement(
              'abbr',
              { title: 'Friday' },
              'Fri'
            )
          ),
          _react2.default.createElement(
            'th',
            { className: 'DateRangePicker__WeekdayHeading', key: 'Saturday,Sat', scope: 'col' },
            _react2.default.createElement(
              'abbr',
              { title: 'Saturday' },
              'Sat'
            )
          )
        ));
      });

      it('which has a body containing the weeks', function () {
        expect(this.table.props.children[1].props.children.length).toBeGreaterThan(3);
        expect(this.table.props.children[1].props.children[0].type).toEqual('tr');
        expect(this.table.props.children[1].props.children[1].props.children.length).toBe(7);
        expect(this.table.props.children[1].props.children[1].props.children[0].type).toBe(_CalendarDate2.default);
      });
    });
  });
});