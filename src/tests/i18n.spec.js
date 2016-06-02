import React from 'react';
import TestUtils from 'react-addons-test-utils';
import moment from 'moment';
import _ from 'underscore';
import CalendarMonth from '../calendar/CalendarMonth';
import CalendarDate from '../calendar/CalendarDate';

describe('Localization', function () {

  const testLocale = 'ar';

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
        bemBlock: 'DateRangePicker',
        locale: props.locale || 'en',
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

    this.firstOfMonth = moment();
  });

  afterEach( function () {
    if (this.component) {
      React.unmountComponentAtNode(React.findDOMNode(this.component).parentNode);
    }
  });

  it('renders the proper month header', function () {

    require(`moment/locale/${testLocale}`);
    moment.locale(testLocale);
    this.useShallowRenderer({
      locale: testLocale,
    });

    const currentMonth = moment().format('MMMM');
    const headerMonthLabel = this.container.props.children[0].props.children[0];

    expect(headerMonthLabel).toEqual(currentMonth);
  });

  it('renders the proper month options', function () {

    require(`moment/locale/${testLocale}`);
    moment.locale(testLocale);
    this.useShallowRenderer({
      locale: testLocale,
    });

    const months = moment.localeData(testLocale)._months;

    const headerMonthSelect = this.container.props.children[0].props.children[1];

    headerMonthSelect.props.children.map((option, index) => {
      const optionText = option.props.children;
      expect(optionText).toEqual(months[index]);
    });

  });

  it('renders the proper year header', function() {
    require(`moment/locale/${testLocale}`);
    moment.locale(testLocale);
    this.useShallowRenderer({
      locale: testLocale,
    });

    const currentYear = moment().format('YYYY');
    const headerYearLabel = this.container.props.children[2].props.children[0];

    expect(headerYearLabel).toEqual(currentYear);

  });

  it('renders the proper year options', function () {

    const years = _.map(_.range(0, 4), (val) => {
      return moment().add(val, 'y').format('YYYY');
    });

    require(`moment/locale/${testLocale}`);
    moment.locale(testLocale);
    this.useShallowRenderer({
      locale: testLocale,
    });

    const headerYearSelect = this.container.props.children[2].props.children[1];

    _.map(_.compact(headerYearSelect.props.children), (option, index) => {
      const optionText = option.props.children;
      expect(optionText).toEqual(years[index]);
    });

  });
});
