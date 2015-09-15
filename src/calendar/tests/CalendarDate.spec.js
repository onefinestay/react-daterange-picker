import React from 'react/addons';
import moment from 'moment';

import CalendarDate from '../CalendarDate.jsx';

import CalendarDatePeriod from '../CalendarDatePeriod.jsx';
import CalendarHighlight from '../CalendarHighlight.jsx';
import CalendarSelection from '../CalendarSelection.jsx';

const TestUtils = React.addons.TestUtils;

describe('The CalendarDate Component', function () {

  const getCalendarDate = (props) => {

    props = props || {};

    return (<CalendarDate
      date={props.date || moment()}
      firstOfMonth={props.firstOfMonth || moment()}
      dateRangesForDate={function () {
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
      }}
      onSelectDate={this.selectDateSpy}
      onHighlightDate={this.highlightDateSpy}
      onUnHighlightDate={this.unHighlightDateSpy}
      isHighlightedDate={props.isHighlightedDate || false }
      isSelectedDate={props.isSelectedDate || false }
      isSelectedRangeStart={props.isSelectedRangeStart || false }
      isSelectedRangeEnd={props.isSelectedRangeEnd || false }
      isHighlightedRangeStart={props.isHighlightedRangeStart || false }
      isHighlightedRangeEnd={props.isHighlightedRangeEnd || false }
      isInSelectedRange={props.isInSelectedRange || false }
      isInHighlightedRange={props.isInHighlightedRange || false }
      isToday={props.isToday || false }
      isDisabled={props.isDisabled || false }
      />);
  };

  const useShallowRenderer = (props) => {
    this.shallowRenderer = TestUtils.createRenderer();
    this.shallowRenderer.render(getCalendarDate(props));
    this.renderedComponent = this.shallowRenderer.getRenderOutput();
  };

  const useDocumentRenderer = (props) => {
    const renderedTable = TestUtils.renderIntoDocument(<table>
      <tbody>{getCalendarDate(props)}</tbody>
    </table>);
    this.renderedComponent = TestUtils.findRenderedDOMComponentWithTag(renderedTable, 'td');
  };

  beforeEach(() => {
    this.spyCx = spyOn(CalendarDate.prototype.__reactAutoBindMap, 'cx').and.callFake( (data) => {
      return data.element || 'my-class';
    });
    this.selectDateSpy = jasmine.createSpy();
    this.highlightDateSpy = jasmine.createSpy();
    this.unHighlightDateSpy = jasmine.createSpy();
  });

  it('creates the right element', () => {
    useShallowRenderer();
    expect(this.renderedComponent.type).toBe('td');
  });

  describe('sets the correct class', () => {

    it('by defininig the expected class', () => {
      useShallowRenderer();
      expect(this.renderedComponent.props.className).toEqual('Date');
    });

    it('by calling cx with a Date element', () => {
      useShallowRenderer();
      expect(this.spyCx).toHaveBeenCalledWith({
        element: 'Date',
        modifiers: jasmine.any(Object),
        states: jasmine.any(Object),
      });
    });

    describe('by setting the expected bem modifiers', () => {

      it('when the provided date is today', () => {
        useShallowRenderer({
          isToday: true,
        });
        expect(this.spyCx).toHaveBeenCalledWith({
          element: jasmine.any(String),
          modifiers: {today: true, weekend: jasmine.any(Boolean), otherMonth: jasmine.any(Boolean)},
          states: jasmine.any(Object),
        });
      });


      it('when the provided date is not today', () => {
        useShallowRenderer({
          isToday: false,
        });
        expect(this.spyCx).toHaveBeenCalledWith({
          element: jasmine.any(String),
          modifiers: {today: false, weekend: jasmine.any(Boolean), otherMonth: jasmine.any(Boolean)},
          states: jasmine.any(Object),
        });
      });

      it('when the provided date is over the weekend', () => {
        var nextSunday = moment().day(7);
        useShallowRenderer({
          date: nextSunday,
        });
        expect(this.spyCx).toHaveBeenCalledWith({
          element: jasmine.any(String),
          modifiers: {today: jasmine.any(Boolean), weekend: true, otherMonth: jasmine.any(Boolean)},
          states: jasmine.any(Object),
        });
      });


      it('when the provided date is not over the weekend', () => {
        let nextMonday = moment().day(8);
        useShallowRenderer({
          date: nextMonday,
        });
        expect(this.spyCx).toHaveBeenCalledWith({
          element: jasmine.any(String),
          modifiers: {today: jasmine.any(Boolean), weekend: false, otherMonth: jasmine.any(Boolean)},
          states: jasmine.any(Object),
        });
      });

      it('when the provided date is during the same month', () => {
        let date = moment().date(8).month(3),
          firstOfMonth = moment().date(1).month(3);
        useShallowRenderer({
          date: date,
          firstOfMonth: firstOfMonth,
        });
        expect(this.spyCx).toHaveBeenCalledWith({
          element: jasmine.any(String),
          modifiers: {today: jasmine.any(Boolean), weekend: jasmine.any(Boolean), otherMonth: false},
          states: jasmine.any(Object),
        });
      });


      it('when the provided date is not during the same month', () => {
        let date = moment().date(8).month(3),
          firstOfMonth = moment().date(1).month(43);
        useShallowRenderer({
          date: date,
          firstOfMonth: firstOfMonth,
        });
        expect(this.spyCx).toHaveBeenCalledWith({
          element: jasmine.any(String),
          modifiers: {today: jasmine.any(Boolean), weekend: jasmine.any(Boolean), otherMonth: true},
          states: jasmine.any(Object),
        });
      });
    });

    describe('by setting the expected bem states', () => {

      it('when the isDisabled prop is passed in', () => {
        useShallowRenderer({
          isDisabled: true,
        });
        expect(this.spyCx).toHaveBeenCalledWith({
          element: jasmine.any(String),
          modifiers: jasmine.any(Object),
          states: {disabled: true, highlighted: jasmine.any(Boolean), selected: jasmine.any(Boolean)},
        });
      });

      it('when the isDisabled prop is not passed in', () => {
        useShallowRenderer({
          isDisabled: false,
        });
        expect(this.spyCx).toHaveBeenCalledWith({
          element: jasmine.any(String),
          modifiers: jasmine.any(Object),
          states: {disabled: false, highlighted: jasmine.any(Boolean), selected: jasmine.any(Boolean)},
        });
      });

      it('when the isHighlightedDate prop is passed in', () => {
        useShallowRenderer({
          isHighlightedDate: true,
        });
        expect(this.spyCx).toHaveBeenCalledWith({
          element: jasmine.any(String),
          modifiers: jasmine.any(Object),
          states: {disabled: jasmine.any(Boolean), highlighted: true, selected: jasmine.any(Boolean)},
        });
      });

      it('when the isHighlightedDate prop is not passed in', () => {
        useShallowRenderer({
          isHighlightedDate: false,
        });
        expect(this.spyCx).toHaveBeenCalledWith({
          element: jasmine.any(String),
          modifiers: jasmine.any(Object),
          states: {disabled: jasmine.any(Boolean), highlighted: false, selected: jasmine.any(Boolean)},
        });
      });

      it('when the isSelectedDate prop is passed in', () => {
        useShallowRenderer({
          isSelectedDate: true,
        });
        expect(this.spyCx).toHaveBeenCalledWith({
          element: jasmine.any(String),
          modifiers: jasmine.any(Object),
          states: {disabled: jasmine.any(Boolean), highlighted: jasmine.any(Boolean), selected: true},
        });
      });

      it('when the isInSelectedRange prop is passed in', () => {
        useShallowRenderer({
          isInSelectedRange: true,
        });
        expect(this.spyCx).toHaveBeenCalledWith({
          element: jasmine.any(String),
          modifiers: jasmine.any(Object),
          states: {disabled: jasmine.any(Boolean), highlighted: jasmine.any(Boolean), selected: true},
        });
      });

      it('when the isInHighlightedRange prop is passed in', () => {
        useShallowRenderer({
          isInHighlightedRange: true,
        });
        expect(this.spyCx).toHaveBeenCalledWith({
          element: jasmine.any(String),
          modifiers: jasmine.any(Object),
          states: {disabled: jasmine.any(Boolean), highlighted: jasmine.any(Boolean), selected: true},
        });
      });

      it('when the isSelectedDate, isInSelectedRange, isInHighlightedRange props are not passed in', () => {
        useShallowRenderer({
          isSelectedDate: false,
          isInSelectedRange: false,
          isInHighlightedRange: false,
        });
        expect(this.spyCx).toHaveBeenCalledWith({
          element: jasmine.any(String),
          modifiers: jasmine.any(Object),
          states: {disabled: jasmine.any(Boolean), highlighted: jasmine.any(Boolean), selected: false},
        });
      });

    });

  });

  describe('creates the right style', () => {

    it('when numStyles is 1', () => {
      useShallowRenderer();
      expect(this.renderedComponent.props.style.borderLeftColor).toEqual('#29');
      expect(this.renderedComponent.props.style.borderRightColor).toEqual('#29');
    });

    it('when numStyles is 2', () => {
      useShallowRenderer({count: 2});
      expect(this.renderedComponent.props.style.borderLeftColor).toEqual('#29');
      expect(this.renderedComponent.props.style.borderRightColor).toEqual('#3a');
    });


  });

  describe('handles touch events', () => {

    beforeEach(() => {
      useDocumentRenderer();
      TestUtils.Simulate.touchStart(this.renderedComponent);
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('touchend', false, false, null);
      document.dispatchEvent(evt);
    });


    it('by calling props.onHighlightDate after an interaction', () => {
      expect(this.highlightDateSpy).toHaveBeenCalled();
    });

    it('by calling props.onSelectDate after an interaction', () => {
      expect(this.selectDateSpy).toHaveBeenCalled();
    });

  });

  describe('handles mouse events', () => {

    //MouseEnter and MouseLeave are buggy. Should be fixed in React#0.14
    //Workaround as suggested from https://github.com/facebook/react/issues/1297

    beforeEach(() => {
      this.date = moment();
      useDocumentRenderer({
        date: this.date,
      });
    });

    it('by calling props.onHighlightDate after a mouse enter', () => {
      TestUtils.SimulateNative.mouseOver(this.renderedComponent);
      expect(this.highlightDateSpy).toHaveBeenCalledWith(this.date);
    });

    it('by calling props.onSelectDate after mouse down + mouse leave', () => {
      TestUtils.Simulate.mouseDown(this.renderedComponent);
      TestUtils.SimulateNative.mouseOut(this.renderedComponent);
      expect(this.selectDateSpy).toHaveBeenCalledWith(this.date);
    });

    it('by calling props.onUnHighlightDate after a mouse leave', () => {
      TestUtils.SimulateNative.mouseOut(this.renderedComponent);
      expect(this.unHighlightDateSpy).toHaveBeenCalledWith(this.date);
    });

    it('by calling props.onSelectDate after mouse down + mouse up', () => {
      TestUtils.Simulate.mouseDown(this.renderedComponent);
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('mouseup', false, false, null);
      document.dispatchEvent(evt);
      expect(this.selectDateSpy).toHaveBeenCalledWith(this.date);
    });

  });

  describe('handles half days', () => {

    it('by creating calendar date period when there is more than one period', () => {
      useShallowRenderer({count: 2});
      expect(this.renderedComponent.props.children[0]).toEqual(
        <div className='HalfDateStates'>
          <CalendarDatePeriod period='am' color='#333'/>
          <CalendarDatePeriod period='pm' color='#444'/>
        </div>
      );
    });

    it('by creating a simple div when there is only one period', () => {
      useShallowRenderer();
      const bg = {
        backgroundColor: '#333',
      };
      expect(this.renderedComponent.props.children[1]).toEqual(
        <div className='FullDateStates' style={bg}>
        </div>
      );
    });
  });

  describe('has a selection widget', () => {
    it('with a modifier prop of single if props.isSelectedDate is true and others false', () => {
      useShallowRenderer({isSelectedDate: true});
      expect(this.renderedComponent.props.children[3]).toEqual(
        <CalendarSelection modifier='single' pending={false}/>
      );
    });

    it('with a modifier prop of single if props.isSelectedRangeStart, props.isSelectedRangeEnd are true and others false', () => {
      useShallowRenderer({isSelectedRangeStart: true, isSelectedRangeEnd: true});
      expect(this.renderedComponent.props.children[3]).toEqual(
        <CalendarSelection modifier='single' pending={false}/>
      );
    });

    it('with a modifier prop of single if props.isHighlightedRangeStart, props.isHighlightedRangeEnd are true and others false', () => {
      useShallowRenderer({isHighlightedRangeStart: true, isHighlightedRangeEnd: true});
      expect(this.renderedComponent.props.children[3]).toEqual(
        <CalendarSelection modifier='single' pending={false}/>
      );
    });

    it('with a modifier prop of start if props.isSelectedRangeStart is true and others false', () => {
      useShallowRenderer({isSelectedRangeStart: true, isSelectedRangeEnd: false});
      expect(this.renderedComponent.props.children[3]).toEqual(
        <CalendarSelection modifier='start' pending={false}/>
      );
    });

    it('with a modifier prop of start if props.isHighlightedRangeStart is true and others false', () => {
      useShallowRenderer({isHighlightedRangeStart: true, isHighlightedRangeEnd: false});
      expect(this.renderedComponent.props.children[3]).toEqual(
        <CalendarSelection modifier='start' pending={false}/>
      );
    });

    it('with a modifier prop of end if props.isSelectedRangeEnd is true and others false', () => {
      useShallowRenderer({isSelectedRangeEnd: true, isSelectedRangeStart: false});
      expect(this.renderedComponent.props.children[3]).toEqual(
        <CalendarSelection modifier='end' pending={false}/>
      );
    });

    it('with a modifier prop of end if props.isHighlightedRangeEnd is true and others false', () => {
      useShallowRenderer({isHighlightedRangeEnd: true, isHighlightedRangeStart: false});
      expect(this.renderedComponent.props.children[3]).toEqual(
        <CalendarSelection modifier='end' pending={false}/>
      );
    });

    it('with a modifier prop of segment if props.isInSelectedRange is true and others false', () => {
      useShallowRenderer({isInSelectedRange: true});
      expect(this.renderedComponent.props.children[3]).toEqual(
        <CalendarSelection modifier='segment' pending={false}/>
      );
    });

    it('with a modifier prop of segment if props.isInHighlightedRange is true and others false', () => {
      useShallowRenderer({isInHighlightedRange: true});
      expect(this.renderedComponent.props.children[3]).toEqual(
        <CalendarSelection modifier='segment' pending={true}/>
      );
    });

    it('with a pending prop of true if props.isInHighlightedRange is true and any setting showing the CalendarSelection widget', () => {
      useShallowRenderer({isInHighlightedRange: true, isSelectedDate: true});
      expect(this.renderedComponent.props.children[3]).toEqual(
        <CalendarSelection modifier='single' pending={true}/>
      );
    });

    it('which does not show otherwise', () => {
      useShallowRenderer();
      expect(this.renderedComponent.props.children[3]).toEqual(null);
    });
  });

  describe('has a highlight modifier', () => {
    it('which shows when props.isHighlightedDate is true', () => {
      useShallowRenderer({isHighlightedDate: true});
      expect(this.renderedComponent.props.children[4]).toEqual(
        <CalendarHighlight modifier='single'/>
      );
    });

    it('which does not show otherwise', () => {
      useShallowRenderer({isHighlightedDate: false});
      expect(this.renderedComponent.props.children[4]).toEqual(null);
    });
  });

});
