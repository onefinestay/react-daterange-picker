import React from 'react/addons';
import CalendarMonth from '../CalendarMonth';
import CalendarDate from '../CalendarDate';
import moment from 'moment';
import {} from 'moment-range';
import _ from 'underscore';


const TestUtils = React.addons.TestUtils;

describe('The CalendarMonth Component', function () {

  beforeEach(function () {

    const getCalendarMonth = (props) => {

      props = _.extend({
        firstOfWeek: 0,
        firstOfMonth: this.firstOfMonth,
        enabledRange: moment.range(moment(), moment().add(3, 'years')),
        dateComponent: CalendarDate,
        disableNavigation: false,
        dateRangesForDate: function () {
          return {
            count: function () {
              return props.count || 1;
            },
            getIn: function (data) {
              if (data[0] === 0) {
                return '#333';
              }
              return '#444';
            },
          };
        },
        onMonthChange: function () {},
        onYearChange: function () {},
      }, props);


      return (<CalendarMonth {...props} />);
    };

    this.useShallowRenderer = (props) => {
      this.shallowRenderer = TestUtils.createRenderer();
      this.shallowRenderer.render(getCalendarMonth(props));
      this.renderedComponent = this.shallowRenderer.getRenderOutput();
      this.container = this.renderedComponent.props.children[0];
      this.table = this.renderedComponent.props.children[1];
    };

    this.useDocumentRenderer = (props) => {
      this.component = this.renderedComponent = TestUtils.renderIntoDocument(getCalendarMonth(props));
    };

    this.spyCx = spyOn(CalendarMonth.prototype.__reactAutoBindMap, 'cx').and.callFake( (data) => {
      return data.element || 'my-class';
    });
    this.firstOfMonth = moment();
  });

  afterEach( function () {
    if (this.component) {
      React.unmountComponentAtNode(React.findDOMNode(this.component).parentNode);
    }
  });

  it('should render the right element', function () {
    this.useShallowRenderer();
    expect(this.renderedComponent.type).toBe('div');
    expect(this.spyCx).toHaveBeenCalledWith({
      element: 'Month',
    });
    expect(this.renderedComponent.props.className).toEqual('Month');
  });

  describe('has a label acting as a header', function () {

    beforeEach(function () {
      this.useShallowRenderer();
    });

    it('which is a div with the correct class', function () {
      expect(this.container.type).toBe('div');
      expect(this.container.props.className).toEqual('MonthHeader');
      expect(this.spyCx).toHaveBeenCalledWith({
        element: 'MonthHeader',
      });
    });

    describe('displaying month information', function () {

      it('which creates a span with the correct class', function () {

        this.useShallowRenderer();
        const span = this.container.props.children[0];

        expect(span.type).toBe('span');
        expect(span.props.className).toEqual('MonthHeaderLabel');
        expect(this.spyCx).toHaveBeenCalledWith({
          element: 'MonthHeaderLabel',
          modifiers: {
            month: true,
          },
        });
      });

      it('which displays the name of the month', function () {
        this.useShallowRenderer();
        const span = this.container.props.children[0];
        expect(span.props.children[0]).toBe(this.firstOfMonth.format('MMMM'));
      });

      it('which does not show navigation if props.disableNavigation is true', function () {
        this.useShallowRenderer({
          disableNavigation: true,
        });
        const span = this.container.props.children[0];
        expect(span.props.children[1]).toBe(null);
      });

      it('which shows navigation if props.disableNavigation is false', function () {
        this.useShallowRenderer();
        const select = this.container.props.children[0].props.children[1];
        expect(select.type).toBe('select');
        expect(this.spyCx).toHaveBeenCalledWith({
          element: 'MonthHeaderSelect',
        });
        expect(select.props.value).toBe(this.firstOfMonth.month());
        expect(select.props.className).toEqual('MonthHeaderSelect');
        expect(select.props.children.length).toBe(12);
      });

      it('which calls props.onMonthChange if props.disableNavigation is false and if the selected value changes', function () {
        var onMonthChange = jasmine.createSpy();
        this.useDocumentRenderer({
          onMonthChange: onMonthChange,
        });
        var select = TestUtils.scryRenderedDOMComponentsWithTag(this.renderedComponent, 'select')[0].getDOMNode();
        select.value = '2';
        TestUtils.Simulate.change(select);
        expect(onMonthChange).toHaveBeenCalledWith(2);
      });

    });

    describe('displaying year information', function () {

      it('which creates a span with the correct class', function () {

        this.useShallowRenderer();
        const span = this.container.props.children[2];

        expect(span.type).toBe('span');
        expect(span.props.className).toEqual('MonthHeaderLabel');
        expect(this.spyCx).toHaveBeenCalledWith({
          element: 'MonthHeaderLabel',
          modifiers: {
            year: true,
          },
        });
      });

      it('which displays the name of the year', function () {
        this.useShallowRenderer();
        const span = this.container.props.children[2];
        expect(span.props.children[0]).toBe(this.firstOfMonth.format('YYYY'));
      });

      it('which does not show navigation if props.disableNavigation is true', function () {
        this.useShallowRenderer({
          disableNavigation: true,
        });
        const span = this.container.props.children[2];
        expect(span.props.children[1]).toBe(null);
      });

      it('which shows navigation if props.disableNavigation is false', function () {
        this.useShallowRenderer();
        const select = this.container.props.children[2].props.children[1];
        expect(select.type).toBe('select');
        expect(this.spyCx).toHaveBeenCalledWith({
          element: 'MonthHeaderSelect',
        });
        expect(select.props.value).toBe(this.firstOfMonth.year());
        expect(select.props.className).toEqual('MonthHeaderSelect');
        expect(select.props.children.length).toBe(15);
      });

      it('which calls props.onYearChange if props.disableNavigation is false and if the selected value changes', function () {
        var onYearChange = jasmine.createSpy();
        this.useDocumentRenderer({
          onYearChange: onYearChange,
        });
        var select = TestUtils.scryRenderedDOMComponentsWithTag(this.renderedComponent, 'select')[1].getDOMNode();
        var value = (this.firstOfMonth.year() + 1).toString();
        select.value = value;
        TestUtils.Simulate.change(select);
        expect(onYearChange).toHaveBeenCalledWith(parseInt(value, 10));
      });

    });

    describe('has a table', function () {

      it('which has the expected className', function () {
        this.useShallowRenderer();
        expect(this.table.type).toBe('table');
        expect(this.table.props.className).toEqual('MonthDates');
        expect(this.spyCx).toHaveBeenCalledWith({
          element: 'MonthDates',
        });
      });

      it('whose head contains day information', function () {
        expect(this.table.props.children[0].props.children).toEqual(<tr className='Weekdays'>
          <th className='WeekdayHeading' key='Sunday,Sun' scope='col'><abbr title='Sunday'>Sun</abbr></th>
          <th className='WeekdayHeading' key='Monday,Mon' scope='col'><abbr title='Monday'>Mon</abbr></th>
          <th className='WeekdayHeading' key='Tuesday,Tue' scope='col'><abbr title='Tuesday'>Tue</abbr></th>
          <th className='WeekdayHeading' key='Wednesday,Wed' scope='col'><abbr title='Wednesday'>Wed</abbr></th>
          <th className='WeekdayHeading' key='Thursday,Thu' scope='col'><abbr title='Thursday'>Thu</abbr></th>
          <th className='WeekdayHeading' key='Friday,Fri' scope='col'><abbr title='Friday'>Fri</abbr></th>
          <th className='WeekdayHeading' key='Saturday,Sat' scope='col'><abbr title='Saturday'>Sat</abbr></th>
        </tr>);
      });

      it('which has a body containing the weeks', function () {
        expect(this.table.props.children[1].props.children.length).toBeGreaterThan(3);
        expect(this.table.props.children[1].props.children[0].type).toEqual('tr');
        expect(this.table.props.children[1].props.children[1].props.children.length).toBe(7);
        expect(this.table.props.children[1].props.children[1].props.children[0].type).toBe(CalendarDate);
      });

    });

  });
});
