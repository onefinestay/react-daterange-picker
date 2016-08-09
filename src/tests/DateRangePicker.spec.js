import DateRangePicker from '../DateRangePicker';
import PaginationArrow from '../PaginationArrow';
import CalendarMonth from '../calendar/CalendarMonth';
import Legend from '../Legend.jsx';

import moment from 'moment';
import 'moment-range';
import isMomentRange from '../utils/isMomentRange';
import areMomentRangesEqual from '../utils/areMomentRangesEqual';
import Immutable from 'immutable';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import _ from 'underscore';


describe('The DateRangePicker component', function () {

  beforeEach(function () {

    const getDateRangePicker = (props) => {
      props = _.extend({}, props);
      return (<DateRangePicker {...props} />);
    };

    this.useShallowRenderer = (props) => {
      this.shallowRenderer = TestUtils.createRenderer();
      this.shallowRenderer.render(getDateRangePicker(props));
      this.renderedComponent = this.shallowRenderer.getRenderOutput();
    };

    this.useDocumentRenderer = (props) => {
      this.component = this.renderedComponent = TestUtils.renderIntoDocument(getDateRangePicker(props));
    };

    this.useDocumentRendererWithComplexStates = () => {
      const stateDefinitions = {
        available: {
        },
        enquire: {
        },
        unavailable: {
          selectable: false,
        },
      };
      this.nonSelectableRange = moment.range(
        moment(new Date(2002, 1, 15)),
        moment(new Date(2003, 1, 15))
      );
      const dateStates = [
        {
          state: 'enquire',
          range: moment.range(
            moment(new Date(2000, 1, 15)),
            moment(new Date(2001, 1, 15))
          ),
        },
        {
          state: 'unavailable',
          range: this.nonSelectableRange,
        },
      ];

      this.useDocumentRenderer({
        initialYear: 2000,
        initialMonth: 6,
        dateStates: dateStates,
        stateDefinitions: stateDefinitions,
        defaultState: 'available',
        minimumDate: new Date(2001, 1, 15),
        maximumDate: new Date(2001, 1, 20),
      });
    };

  });

  afterEach( function () {
    if (this.component) {
      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this.component).parentNode);
    }
  });


  it('defines the expected top level elements', function () {
    this.useShallowRenderer();
    expect(this.renderedComponent.type).toBe('div');
    expect(this.renderedComponent.props.className).toBe('DateRangePicker');
  });

  it('uses the supplied CSS class', function () {
    this.useShallowRenderer({
      className: 'foo-bar',
    });
    expect(this.renderedComponent.props.className).toBe('DateRangePicker foo-bar');
  });

  describe('contains PaginationArrow components', function () {

    it('2 of them', function () {
      this.useShallowRenderer();
      expect(this.renderedComponent.props.children[0].type).toBe(PaginationArrow);
      expect(this.renderedComponent.props.children[2].type).toBe(PaginationArrow);
    });

    it('the left one gets disabled when we are at the start of the permitted period', function () {
      this.useShallowRenderer({
        minimumDate: new Date(2000, 6, 15),
        initialYear: 2000,
        initialMonth: 6,
      });
      expect(this.renderedComponent.props.children[0].props.disabled).toBe(true);
    });

    it('the left one does not get disabled when we are not at the start of the permitted period', function () {
      this.useShallowRenderer({
        minimumDate: new Date(2000, 1, 15),
        initialYear: 2000,
        initialMonth: 6,
      });
      expect(this.renderedComponent.props.children[0].props.disabled).toBe(false);
    });

    it('the left one when clicked moves the calendar one month in the past', function () {
      this.useDocumentRenderer({
        initialYear: 2000,
        initialMonth: 6,
      });
      var leftArrow = TestUtils.scryRenderedDOMComponentsWithClass(this.renderedComponent, 'DateRangePicker__PaginationArrowIcon')[0];
      TestUtils.Simulate.click(leftArrow);

      expect(this.renderedComponent.state.month).toBe(5);
    });

    it('the right one gets disabled when we are at the end of the permitted period', function () {
      this.useShallowRenderer({
        maximumDate: new Date(2000, 6, 15),
        initialYear: 2000,
        initialMonth: 6,
      });
      expect(this.renderedComponent.props.children[2].props.disabled).toBe(true);
    });

    it('the right one does not get disabled when we are not at the end of the permitted period', function () {
      this.useShallowRenderer({
        maximumDate: new Date(2000, 6, 15),
        initialYear: 2000,
        initialMonth: 6,
      });
      expect(this.renderedComponent.props.children[2].props.disabled).toBe(true);
    });

    it('the right one when clicked moves the calendar one month in the future', function () {
      this.useDocumentRenderer({
        initialYear: 2000,
        initialMonth: 6,
      });
      var rightArrow = TestUtils.scryRenderedDOMComponentsWithClass(this.renderedComponent, 'DateRangePicker__PaginationArrowIcon')[1];
      TestUtils.Simulate.click(rightArrow);

      expect(this.renderedComponent.state.month).toBe(7);
    });

  });

  describe('contains CalendarMonth components', function () {

    describe('which number is', function () {
      it('by default only one', function () {
        this.useShallowRenderer();
        expect(this.renderedComponent.props.children[1].length).toBe(1);
        expect(this.renderedComponent.props.children[1][0].type).toBe(CalendarMonth);
      });

      it('otherwise a number equal to props.numberOfCalendars', function () {
        this.useShallowRenderer({
          numberOfCalendars: 3,
        });
        expect(this.renderedComponent.props.children[1].length).toBe(3);
        expect(this.renderedComponent.props.children[1][0].type).toBe(CalendarMonth);
      });
    });

    describe('for each component the value', function () {

      describe('when it is a moment', function () {

        it('is set to null if it is not included in the corresponding month', function () {
          var value = moment('2003 01 01', 'YYYY MM DD');
          this.useShallowRenderer({
            initialYear: 2000,
            initialMonth: 6,
            value: value,
            selectionType: 'single',
            initialFromValue: false,
          });
          expect(this.renderedComponent.props.children[1][0].props.value).toBe(null);
        });

        it('otherwise it uses props.value', function () {
          var value = moment('2000 06 05', 'YYYY MM DD');
          this.useShallowRenderer({
            initialYear: 2000,
            initialMonth: 5,
            value: value,
            selectionType: 'single',
            initialFromValue: false,
          });
          expect(this.renderedComponent.props.children[1][0].props.value).toBe(value);
        });

      });

      describe('when it is a moment range', function () {

        it('is set to null if it is not overlapping the corresponding month', function () {
          var value = moment.range(moment('2003 01 01', 'YYYY MM DD'), moment('2004 01 01', 'YYYY MM DD'));
          this.useShallowRenderer({
            initialYear: 2000,
            initialMonth: 6,
            value: value,
            selectionType: 'range',
            initialFromValue: false,
          });
          expect(this.renderedComponent.props.children[1][0].props.value).toBe(null);
        });

        it('otherwise it uses props.value', function () {
          var value = moment.range(moment('2000 04 01', 'YYYY MM DD'), moment('2000 09 01', 'YYYY MM DD'));
          this.useShallowRenderer({
            initialYear: 2000,
            initialMonth: 6,
            value: value,
            selectionType: 'range',
            initialFromValue: false,
          });
          expect(this.renderedComponent.props.children[1][0].props.value).toBe(value);
        });

      });

    });

    describe('for each component the highlighted date', function () {

      it('is set to null if it is not a moment', function () {
        var highlightedDate = {};
        this.useDocumentRenderer({
          initialYear: 2000,
          initialMonth: 6,
        });
        this.renderedComponent.highlightDate(highlightedDate);
        var calendarMonthComponent = TestUtils.scryRenderedComponentsWithType(this.renderedComponent, CalendarMonth)[0];
        expect(calendarMonthComponent.props.highlightedDate).toBe(null);
      });

      it('is set to null if the current month does not include the date', function () {
        var highlightedDate = moment('2003 01 01', 'YYYY MM DD');
        this.useDocumentRenderer({
          initialYear: 2000,
          initialMonth: 6,
        });
        this.renderedComponent.highlightDate(highlightedDate);
        var calendarMonthComponent = TestUtils.scryRenderedComponentsWithType(this.renderedComponent, CalendarMonth)[0];
        expect(calendarMonthComponent.props.highlightedDate).toBe(null);
      });

      it('is set to props.highlightedDate otherwise', function () {
        var highlightedDate = moment('2000 07 05', 'YYYY MM DD');
        this.useDocumentRenderer({
          initialYear: 2000,
          initialMonth: 6,
        });
        this.renderedComponent.highlightDate(highlightedDate);
        var calendarMonthComponent = TestUtils.scryRenderedComponentsWithType(this.renderedComponent, CalendarMonth)[0];
        expect(calendarMonthComponent.props.highlightedDate).toBe(highlightedDate);
      });

    });

    describe('for each component the highlighted range', function () {

      it('is set to null if it is not a moment range', function () {
        var highlightedRange = {};
        this.useDocumentRenderer({
          initialYear: 2000,
          initialMonth: 6,
        });
        this.renderedComponent.highlightRange(highlightedRange);
        var calendarMonthComponent = TestUtils.scryRenderedComponentsWithType(this.renderedComponent, CalendarMonth)[0];
        expect(calendarMonthComponent.props.highlightedRange).toBe(null);
      });

      it('is set to null if the current month does not include the date range', function () {
        var highlightedRange = moment.range(moment('2003 01 01', 'YYYY MM DD'), moment('2004 01 01', 'YYYY MM DD'));
        this.useDocumentRenderer({
          initialYear: 2000,
          initialMonth: 6,
        });
        this.renderedComponent.highlightRange(highlightedRange);
        var calendarMonthComponent = TestUtils.scryRenderedComponentsWithType(this.renderedComponent, CalendarMonth)[0];
        expect(calendarMonthComponent.props.highlightedRange).toBe(null);
      });

      it('defaults to props.highlightedRange', function () {
        var highlightedRange = moment.range(moment('1999 01 01', 'YYYY MM DD'), moment('2004 01 01', 'YYYY MM DD'));
        this.useDocumentRenderer({
          initialYear: 2000,
          initialMonth: 6,
        });
        this.renderedComponent.highlightRange(highlightedRange);
        var calendarMonthComponent = TestUtils.scryRenderedComponentsWithType(this.renderedComponent, CalendarMonth)[0];
        expect(calendarMonthComponent.props.highlightedRange).toBe(highlightedRange);
      });

    });

    describe('each component takes in a large number of other attributes', function () {

      it('like props.bemBlock', function () {
        this.useShallowRenderer({
          bemBlock: 'test-bb',
        });
        expect(this.renderedComponent.props.children[1][0].props.bemBlock).toBe('test-bb');
      });

      it('like props.bemNamespace', function () {
        this.useShallowRenderer({
          bemNamespace: 'test-bn',
        });
        expect(this.renderedComponent.props.children[1][0].props.bemNamespace).toBe('test-bn');
      });

      it('like props.firstOfWeek', function () {
        this.useShallowRenderer({
          firstOfWeek: 0,
        });
        expect(this.renderedComponent.props.children[1][0].props.firstOfWeek).toBe(0);
      });


    });

    describe('each component is provided with a number of event handlers', function () {

      it('onMonthChange calls #changeMonth', function () {
        this.useDocumentRenderer({
          initialMonth: 6,
        });
        var calendarMonthComponent = TestUtils.scryRenderedComponentsWithType(this.renderedComponent, CalendarMonth)[0];
        calendarMonthComponent.props.onMonthChange(5);
        expect(this.renderedComponent.state.month).toBe(5);
      });

      it('onYearChange calls #changeYear', function () {
        this.useDocumentRenderer({
          initialYear: 2000,
        });
        var calendarMonthComponent = TestUtils.scryRenderedComponentsWithType(this.renderedComponent, CalendarMonth)[0];
        calendarMonthComponent.props.onYearChange(2015);
        expect(this.renderedComponent.state.year).toBe(2015);
      });

      it('onSelectDate calls #onSelectDate', function () {
        this.useDocumentRenderer();
        var calendarMonthComponent = TestUtils.scryRenderedComponentsWithType(this.renderedComponent, CalendarMonth)[0];
        calendarMonthComponent.props.onSelectDate(moment());
        expect(this.renderedComponent.state.selectedStartDate).toBeDefined();

      });

      it('onHighlightDate calls #onHighlightDate', function () {
        this.useDocumentRenderer();
        var calendarMonthComponent = TestUtils.scryRenderedComponentsWithType(this.renderedComponent, CalendarMonth)[0];
        calendarMonthComponent.props.onHighlightDate(moment());
        expect(this.renderedComponent.state.highlightedDate).toBeDefined();
      });

      it('onUnHighlightDate calls #onUnHighlightDate', function () {
        this.useDocumentRenderer();
        var calendarMonthComponent = TestUtils.scryRenderedComponentsWithType(this.renderedComponent, CalendarMonth)[0];
        calendarMonthComponent.props.onHighlightDate(moment());
        calendarMonthComponent.props.onUnHighlightDate(moment());
        expect(this.renderedComponent.state.highlightedDate).toBe(null);
      });

    });

  });

  describe('defines a number of actions', function () {

    describe('#changeMonth', function () {
      it('changes the state month to the provided value', function () {
        this.useDocumentRenderer({
          initialYear: 2000,
          initialMonth: 6,
        });
        var month = 2;
        this.renderedComponent.changeMonth(month);
        expect(this.renderedComponent.state.month).toBe(2);
      });
    });

    describe('#changeYear', function () {
      it('changes the state month to the provided value', function () {
        this.useDocumentRenderer({
          initialYear: 2000,
          initialMonth: 6,
        });
        var year = 2001;
        this.renderedComponent.changeYear(year);
        expect(this.renderedComponent.state.year).toBe(2001);
      });
    });

    describe('#onSelectDate', function () {

      describe('if props.selectionType is single', function () {

        beforeEach( function () {
          this.useDocumentRenderer({
            initialYear: 2000,
            initialMonth: 6,
            selectionType: 'single',
          });
          this.spy = spyOn(this.renderedComponent, 'completeSelection');
        });

        it('if the date is disabled, it does not call #completeSelection', function () {
          spyOn(this.renderedComponent, 'isDateDisabled').and.returnValue(true);
          spyOn(this.renderedComponent, 'isDateSelectable').and.returnValue(true);
          this.renderedComponent.onSelectDate();
          expect(this.spy).not.toHaveBeenCalled();
        });

        it('if the date is not selectable, it does not call #completeSelection', function () {
          spyOn(this.renderedComponent, 'isDateDisabled').and.returnValue(false);
          spyOn(this.renderedComponent, 'isDateSelectable').and.returnValue(false);
          this.renderedComponent.onSelectDate();
          expect(this.spy).not.toHaveBeenCalled();
        });

        it('otherwise, it calls #completeSelection', function () {
          spyOn(this.renderedComponent, 'isDateDisabled').and.returnValue(false);
          spyOn(this.renderedComponent, 'isDateSelectable').and.returnValue(true);
          this.renderedComponent.onSelectDate();
          expect(this.spy).toHaveBeenCalled();
        });

      });

      describe('if props.selectionType is range', function () {

        beforeEach( function () {
          this.useDocumentRenderer({
            initialYear: 2000,
            initialMonth: 6,
            selectionType: 'range',
          });
          spyOn(this.renderedComponent, 'completeRangeSelection');
          spyOn(this.renderedComponent, 'startRangeSelection');
          spyOn(this.renderedComponent, 'highlightRange');
        });

        describe('if state.selectedStartDate is defined', function () {

          it('calls #completeRangeSelection', function () {
            this.renderedComponent.setState({
              selectedStartDate: 'abc',
            });
            this.renderedComponent.onSelectDate();
            expect(this.renderedComponent.completeRangeSelection).toHaveBeenCalled();
          });

        });

        describe('if state.selectedStartDate is undefined', function () {

          it('does not call #completeRangeSelection', function () {
            this.renderedComponent.onSelectDate();
            expect(this.renderedComponent.completeRangeSelection).not.toHaveBeenCalled();
          });

          describe('if the date is disabled', function () {

            it('does not call #startRangeSelection', function () {
              spyOn(this.renderedComponent, 'isDateDisabled').and.returnValue(true);
              spyOn(this.renderedComponent, 'isDateSelectable').and.returnValue(false);
              this.renderedComponent.onSelectDate();
              expect(this.renderedComponent.startRangeSelection).not.toHaveBeenCalled();
            });

          });

          describe('if the date is not selectable', function () {

            it('does not call #startRangeSelection', function () {
              spyOn(this.renderedComponent, 'isDateDisabled').and.returnValue(false);
              spyOn(this.renderedComponent, 'isDateSelectable').and.returnValue(false);
              this.renderedComponent.onSelectDate();
              expect(this.renderedComponent.startRangeSelection).not.toHaveBeenCalled();
            });

          });

          describe('if the date is not disabled and is selectable', function () {

            beforeEach( function () {
              spyOn(this.renderedComponent, 'isDateDisabled').and.returnValue(false);
              spyOn(this.renderedComponent, 'isDateSelectable').and.returnValue(true);
              this.date = {};
            });

            it('calls #startRangeSelection', function () {
              this.renderedComponent.onSelectDate(this.date);
              expect(this.renderedComponent.startRangeSelection).toHaveBeenCalledWith(this.date);
            });

            it('if props.singleDateRange is falsy, it does not call #highlightRange', function () {
              this.renderedComponent.onSelectDate(this.date);
              expect(this.renderedComponent.highlightRange).not.toHaveBeenCalled();
            });

            it('if props.singleDateRange is true, it calls #highlightRange', function () {
              this.useDocumentRenderer({
                initialYear: 2000,
                initialMonth: 6,
                selectionType: 'range',
                singleDateRange: true,
              });
              spyOn(this.renderedComponent, 'isDateDisabled').and.returnValue(false);
              spyOn(this.renderedComponent, 'isDateSelectable').and.returnValue(true);
              spyOn(this.renderedComponent, 'highlightRange');
              this.renderedComponent.onSelectDate(this.date);
              expect(this.renderedComponent.highlightRange).toHaveBeenCalled();
              var range = this.renderedComponent.highlightRange.calls.first().args[0];
              expect(isMomentRange(range)).toBe(true);
              expect(areMomentRangesEqual(range, moment.range(this.date, this.date))).toBe(true);
            });

          });

        });

      });

    });

    describe('#onHighlightDate', function () {

      describe('if props.selectionType is a single date', function () {
        beforeEach( function () {
          this.useDocumentRenderer({
            initialYear: 2000,
            initialMonth: 6,
            selectionType: 'single',
          });
          this.spy = spyOn(this.renderedComponent, 'highlightDate');
        });

        it('if the date is disabled, it does not call #highlightDate', function () {
          spyOn(this.renderedComponent, 'isDateDisabled').and.returnValue(true);
          spyOn(this.renderedComponent, 'isDateSelectable').and.returnValue(true);
          this.renderedComponent.onHighlightDate();
          expect(this.spy).not.toHaveBeenCalled();
        });

        it('if the date is not selectable, it does not call #highlightDate', function () {
          spyOn(this.renderedComponent, 'isDateDisabled').and.returnValue(false);
          spyOn(this.renderedComponent, 'isDateSelectable').and.returnValue(false);
          this.renderedComponent.onHighlightDate();
          expect(this.spy).not.toHaveBeenCalled();
        });

        it('otherwise, it calls #highlightDate', function () {
          spyOn(this.renderedComponent, 'isDateDisabled').and.returnValue(false);
          spyOn(this.renderedComponent, 'isDateSelectable').and.returnValue(true);
          var date = {};
          this.renderedComponent.onHighlightDate(date);
          expect(this.spy).toHaveBeenCalledWith(date);
        });
      });

      describe('if props.selectionType is a range', function () {

        beforeEach( function () {
          this.useDocumentRenderer({
            initialYear: 2000,
            initialMonth: 6,
            selectionType: 'range',
          });
          this.spy = spyOn(this.renderedComponent, 'highlightDate');
        });

        describe('if state.selectedStartDate is defined', function () {

          it('calls #highlightRange', function () {
            var range = moment.range();
            spyOn(this.renderedComponent, 'sanitizeRange').and.returnValue(range);
            spyOn(this.renderedComponent, 'highlightRange');
            this.renderedComponent.setState({
              selectedStartDate: moment(),
            });
            this.renderedComponent.onHighlightDate(moment());
            expect(this.renderedComponent.highlightRange).toHaveBeenCalledWith(range);
          });

        });

        describe('if state.selectedStartDate is undefined', function () {

          it('if the date is disabled, it does not call #highlightDate', function () {
            spyOn(this.renderedComponent, 'isDateDisabled').and.returnValue(true);
            spyOn(this.renderedComponent, 'isDateSelectable').and.returnValue(true);
            this.renderedComponent.onHighlightDate();
            expect(this.spy).not.toHaveBeenCalled();
          });

          it('if the date is not selectable, it does not call #highlightDate', function () {
            spyOn(this.renderedComponent, 'isDateDisabled').and.returnValue(false);
            spyOn(this.renderedComponent, 'isDateSelectable').and.returnValue(false);
            this.renderedComponent.onHighlightDate();
            expect(this.spy).not.toHaveBeenCalled();
          });

          it('otherwise, it calls #highlightDate', function () {
            spyOn(this.renderedComponent, 'isDateDisabled').and.returnValue(false);
            spyOn(this.renderedComponent, 'isDateSelectable').and.returnValue(true);
            var date = {};
            this.renderedComponent.onHighlightDate(date);
            expect(this.spy).toHaveBeenCalledWith(date);
          });

        });

      });

    });

    describe('#onUnHighlightDate', function () {

      it('updates the highlightedDate state to null', function () {
        this.useDocumentRenderer({
          initialYear: 2000,
          initialMonth: 6,
        });
        this.renderedComponent.setState({
          highlightedDate: moment(),
        });
        this.renderedComponent.onUnHighlightDate();
        expect(this.renderedComponent.state.highlightedDate).toBe(null);
      });

    });

  });

  describe('contains a help message', function () {

    it('if props.helpMessage is defined', function () {
      this.useShallowRenderer({
        helpMessage: 'help',
      });
      var helpSpan = this.renderedComponent.props.children[3];
      expect(helpSpan.type).toBe('span');
      expect(helpSpan.props).toEqual({
        className: 'DateRangePicker__HelpMessage',
        children: 'help',
      });
    });

    it('but not otherwise', function () {
      this.useShallowRenderer();
      expect(this.renderedComponent.props.children[3]).toBe(null);
    });

  });

  describe('contains a Legend component', function () {

    it('if props.showLegend is defined', function () {
      this.useShallowRenderer({
        showLegend: true,
        selectedLabel: 'label',
      });
      var legendComponent = this.renderedComponent.props.children[4];
      expect(legendComponent.type).toBe(Legend);
      expect(legendComponent.props.selectedLabel).toBe('label');
    });

    it('but not otherwise', function () {
      this.useShallowRenderer();
      expect(this.renderedComponent.props.children[4]).toBe(null);
    });

  });

  describe('#componentWillReceiveProps', function () {

    beforeEach( function () {
      this.useDocumentRenderer({
        initialYear: 2000,
        initialMonth: 6,
      });
      spyOn(this.renderedComponent, 'render').and.callFake( function () {
        return <div></div>;
      });
    });

    it('updates state.dateStates if data provided in the props', function () {
      var newDateStates = ['newDateStates'];
      spyOn(this.renderedComponent, 'getDateStates').and.returnValue(newDateStates);
      spyOn(this.renderedComponent, 'getEnabledRange').and.returnValue('newEnabledRange');
      this.renderedComponent.setState({
        dateStates: ['oldDateStates'],
      });
      this.renderedComponent.componentWillReceiveProps({});
      expect(this.renderedComponent.state.dateStates).toBe(newDateStates);
    });

    it('updates state.enabledRange if data provided in the props', function() {
      var newEnabledRange = moment.range(moment('2003 01 01', 'YYYY MM DD'), moment('2005 01 01', 'YYYY MM DD'));
      spyOn(this.renderedComponent, 'getDateStates').and.returnValue(['newDateStates']);
      spyOn(this.renderedComponent, 'getEnabledRange').and.returnValue(newEnabledRange);
      this.renderedComponent.setState({
        enabledRange: moment.range(moment('2003 01 01', 'YYYY MM DD'), moment('2004 01 01', 'YYYY MM DD')),
      });
      this.renderedComponent.componentWillReceiveProps({});
      expect(this.renderedComponent.state.enabledRange).toBe(newEnabledRange);
    });

  });

  describe('#isDateSelectable', function () {

    beforeEach( function () {
      this.useDocumentRendererWithComplexStates();
    });

    it('returns true if the date is selectable', function () {
      expect(this.renderedComponent.isDateSelectable(new Date(2000, 1, 20))).toBe(true);
    });

    it('returns false otherwise', function () {
      expect(this.renderedComponent.isDateSelectable(new Date(2002, 1, 20))).toBe(false);
    });

  });

  describe('#nonSelectableStateRanges', function () {

    beforeEach( function () {
      this.useDocumentRendererWithComplexStates();
    });

    it('returns the expected range', function () {
      var list = this.renderedComponent.nonSelectableStateRanges();
      expect(list).toEqual(jasmine.any(Immutable.List));
      expect(areMomentRangesEqual(list.get(0).get('range'), this.nonSelectableRange)).toBe(true);
    });

  });

  describe('#dateRangesForDate', function () {

    beforeEach( function () {
      this.useDocumentRendererWithComplexStates();
    });

    it('returns the expected range', function () {
      var list = this.renderedComponent.dateRangesForDate(new Date(2002, 6, 15));
      expect(list).toEqual(jasmine.any(Immutable.List));
      expect(list.get(0).get('state')).toBe('unavailable');
    });

  });

  describe('#sanitizeRange', function () {

    beforeEach( function () {
      this.useDocumentRendererWithComplexStates();
    });

    describe('if forwards is true', function () {

      it('and if the provided range intersects with the non selectable ranges it returns a smaller range', function () {
        var range = this.renderedComponent.sanitizeRange(moment.range(
          moment(new Date(2001, 1, 15)),
          moment(new Date(2003, 1, 15))
        ), true);
        expect(areMomentRangesEqual(range, moment.range(
          moment(new Date(2001, 1, 15)),
          moment(new Date(2002, 1, 15))
        ))).toBe(true);
      });

      it('and if the provided range starts before the enabled range it returns a smaller range', function () {
        var range = this.renderedComponent.sanitizeRange(moment.range(
          moment(new Date(2001, 1, 15)),
          moment(new Date(2002, 1, 1))
        ), true);
        expect(areMomentRangesEqual(range, moment.range(
          moment(new Date(2001, 1, 15)),
          moment(new Date(2001, 1, 20))
        ))).toBe(true);
      });

      it('and if the provided range finishes after the enabled range it returns a smaller range', function () {
        var range = this.renderedComponent.sanitizeRange(moment.range(
          moment(new Date(2006, 1, 15)),
          moment(new Date(2007, 1, 1))
        ), true);
        expect(areMomentRangesEqual(range, moment.range(
          moment(new Date(2006, 1, 15)),
          moment(new Date(2001, 1, 20))
        ))).toBe(true);
      });

      it('otherwise it returns the full range', function () {
        var range = this.renderedComponent.sanitizeRange(moment.range(
          moment(new Date(2001, 1, 15)),
          moment(new Date(2001, 1, 17))
        ), true);
        expect(areMomentRangesEqual(range, moment.range(
          moment(new Date(2001, 1, 15)),
          moment(new Date(2001, 1, 17))
        ))).toBe(true);
      });

    });

    describe('otherwise', function () {
      it('and if the provided range intersects with the non selectable ranges it returns a smaller range', function () {
        var range = this.renderedComponent.sanitizeRange(moment.range(
          moment(new Date(2001, 1, 15)),
          moment(new Date(2005, 1, 15))
        ), false);
        expect(areMomentRangesEqual(range, moment.range(
          moment(new Date(2003, 1, 15)),
          moment(new Date(2005, 1, 15))
        ))).toBe(true);
      });

      it('and if the provided range starts before the enabled range it returns a smaller range', function () {
        var range = this.renderedComponent.sanitizeRange(moment.range(
          moment(new Date(2001, 1, 15)),
          moment(new Date(2002, 1, 1))
        ), false);
        expect(areMomentRangesEqual(range, moment.range(
          moment(new Date(2001, 1, 15)),
          moment(new Date(2001, 1, 20))
        ))).toBe(true);
      });

      it('and if the provided range finishes after the enabled range it returns a smaller range', function () {
        var range = this.renderedComponent.sanitizeRange(moment.range(
          moment(new Date(2006, 1, 15)),
          moment(new Date(2007, 1, 1))
        ), false);
        expect(areMomentRangesEqual(range, moment.range(
          moment(new Date(2006, 1, 15)),
          moment(new Date(2001, 1, 20))
        ))).toBe(true);
      });

      it('otherwise it returns the full range', function () {
        var range = this.renderedComponent.sanitizeRange(moment.range(
          moment(new Date(2001, 1, 15)),
          moment(new Date(2001, 1, 17))
        ), false);
        expect(areMomentRangesEqual(range, moment.range(
          moment(new Date(2001, 1, 15)),
          moment(new Date(2001, 1, 17))
        ))).toBe(true);
      });
    });

  });

  describe('#statesForDate', function () {

    beforeEach( function () {
      this.useDocumentRendererWithComplexStates();
    });

    it('returns the expected state for the provided date', function () {
      var list = this.renderedComponent.statesForDate(moment(new Date(2003, 1, 1)));
      expect(list).toEqual(jasmine.any(Immutable.List));
      expect(list.size).toBe(1);
      expect(list.get(0)).toBe('unavailable');
    });

  });

  describe('#statesForRange', function () {

    beforeEach( function () {
      this.useDocumentRendererWithComplexStates();
    });

    it('returns the expected value if a one-day range is provided', function () {
      var range = moment.range(
        moment(new Date(2003, 1, 1)),
        moment(new Date(2003, 1, 1))
      );
      var list = this.renderedComponent.statesForRange(range);
      expect(list).toEqual(jasmine.any(Immutable.List));
      expect(list.size).toBe(1);
      expect(list.get(0)).toBe('unavailable');
    });

    it('returns the expected value if a multi-day range is provided', function () {
      var range = moment.range(
        moment(new Date(2003, 1, 14)),
        moment(new Date(2003, 1, 16))
      );
      var list = this.renderedComponent.statesForRange(range);
      expect(list).toEqual(jasmine.any(Immutable.List));
      expect(list.size).toBe(2);
      expect(list.get(0)).toBe('unavailable');
      expect(list.get(1)).toBe('available');
    });

  });

  describe('#completeSelection', function () {

    beforeEach( function () {
      this.selectSpy = jasmine.createSpy();
      this.useDocumentRenderer({
        initialYear: 2000,
        initialMonth: 6,
        onSelect: this.selectSpy,
      });
    });

    describe('if state.highlightedDate is defined', function () {

      beforeEach( function () {
        this.highlightedDate = moment();
        this.renderedComponent.setState({
          highlightedDate: this.highlightedDate,
          hideSelection: true,
        });
      });

      it('updates states', function () {
        this.renderedComponent.completeSelection();
        expect(this.renderedComponent.state.hideSelection).toBe(false);
        expect(this.renderedComponent.state.highlightedDate).toBe(null);
      });

      it('calls props.onSelect', function () {
        this.renderedComponent.completeSelection();
        expect(this.selectSpy).toHaveBeenCalledWith(this.highlightedDate, jasmine.any(Object));
      });

    });

    describe('if state.highlightedDate is not defined', function () {

      beforeEach( function () {
        this.highlightedDate = moment();
        this.renderedComponent.setState({
          hideSelection: true,
        });
      });

      it('does not update states', function () {
        this.renderedComponent.completeSelection();
        expect(this.renderedComponent.state.hideSelection).toBe(true);
      });

      it('does not call props.onSelect', function () {
        this.renderedComponent.completeSelection();
        expect(this.selectSpy).not.toHaveBeenCalled();
      });

    });

  });

  describe('#completeRangeSelection', function () {

    describe('if state.highlightedRange is defined', function () {

      describe('and its start and end are two different days', function () {

        beforeEach( function () {
          this.selectSpy = jasmine.createSpy();
          this.useDocumentRenderer({
            initialYear: 2000,
            initialMonth: 6,
            onSelect: this.selectSpy,
          });
          this.highlightedRange = moment.range(
            moment(new Date(2005, 1, 1)),
            moment(new Date(2006, 1, 1))
          );
          this.highlightedDate = moment();
          this.renderedComponent.setState({
            highlightedRange: this.highlightedRange,
            selectedStartDate: this.selectedStartDate,
            highlightedDate: this.highlightedDate,
            hideSelection: true,
          });
        });

        it('updates states', function () {
          this.renderedComponent.completeRangeSelection();
          expect(this.renderedComponent.state.highlightedRange).toBe(null);
          expect(this.renderedComponent.state.highlightedRange).toBe(null);
          expect(this.renderedComponent.state.highlightedRange).toBe(null);
          expect(this.renderedComponent.state.highlightedRange).toBe(null);
        });

        it('calls props.onHighlight', function () {
          this.renderedComponent.completeRangeSelection();
          expect(this.selectSpy).toHaveBeenCalledWith(this.highlightedRange, jasmine.any(Object));
        });

      });

      describe('and its start and end are the same day and props.singleDateRange is true', function () {

        beforeEach( function () {
          this.selectSpy = jasmine.createSpy();
          this.useDocumentRenderer({
            initialYear: 2000,
            initialMonth: 6,
            onSelect: this.selectSpy,
            singleDateRange: true,
          });
          this.highlightedRange = moment.range(
            moment(new Date(2005, 1, 1)),
            moment(new Date(2005, 1, 1))
          );
          this.highlightedDate = moment();
          this.renderedComponent.setState({
            highlightedRange: this.highlightedRange,
            selectedStartDate: this.selectedStartDate,
            highlightedDate: this.highlightedDate,
            hideSelection: true,
          });
        });

        it('updates states', function () {
          this.renderedComponent.completeRangeSelection();
          expect(this.renderedComponent.state.highlightedRange).toBe(null);
          expect(this.renderedComponent.state.highlightedRange).toBe(null);
          expect(this.renderedComponent.state.highlightedRange).toBe(null);
          expect(this.renderedComponent.state.highlightedRange).toBe(null);
        });

        it('calls props.onHighlight', function () {
          this.renderedComponent.completeRangeSelection();
          expect(this.selectSpy).toHaveBeenCalledWith(this.highlightedRange, jasmine.any(Object));
        });

      });

      describe('and its start and end are the same day and props.singleDateRange is false', function () {

        beforeEach( function () {
          this.selectSpy = jasmine.createSpy();
          this.useDocumentRenderer({
            initialYear: 2000,
            initialMonth: 6,
            onSelect: this.selectSpy,
            singleDateRange: false,
          });
          this.highlightedRange = moment.range(
            moment(new Date(2005, 1, 1)),
            moment(new Date(2005, 1, 1))
          );
          this.highlightedDate = moment();
          this.renderedComponent.setState({
            highlightedRange: this.highlightedRange,
            selectedStartDate: this.selectedStartDate,
            highlightedDate: this.selectedStartDate,
            hideSelection: true,
          });
        });

        it('does not update states', function () {
          this.renderedComponent.completeRangeSelection();
          expect(this.renderedComponent.state.highlightedRange).toBe(this.highlightedRange);
          expect(this.renderedComponent.state.selectedStartDate).toBe(this.selectedStartDate);
          expect(this.renderedComponent.state.selectedStartDate).toBe(this.selectedStartDate);
          expect(this.renderedComponent.state.hideSelection).toBe(true);
        });

        it('calls props.onHighlight', function () {
          this.renderedComponent.completeRangeSelection();
          expect(this.selectSpy).not.toHaveBeenCalled();
        });

      });

    });

    describe('if state.highlightedRange is not defined', function () {

      beforeEach( function () {
        this.selectSpy = jasmine.createSpy();
        this.useDocumentRenderer({
          initialYear: 2000,
          initialMonth: 6,
          onSelect: this.selectSpy,
        });
        this.highlightedDate = moment();
        this.renderedComponent.setState({
          selectedStartDate: this.selectedStartDate,
          highlightedDate: this.selectedStartDate,
          hideSelection: true,
        });
      });

      it('does not update states', function () {
        this.renderedComponent.completeRangeSelection();
        expect(this.renderedComponent.state.selectedStartDate).toBe(this.selectedStartDate);
        expect(this.renderedComponent.state.selectedStartDate).toBe(this.selectedStartDate);
        expect(this.renderedComponent.state.hideSelection).toBe(true);
      });

      it('calls props.onHighlight', function () {
        this.renderedComponent.completeRangeSelection();
        expect(this.selectSpy).not.toHaveBeenCalled();
      });

    });

  });

});
