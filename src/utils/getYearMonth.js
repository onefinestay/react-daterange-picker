import moment from '../moment-range';
import isMomentRange from './isMomentRange';

export function getYearMonth(date) {
  if (!moment.isMoment(date)) {
    return undefined;
  }

  return { year: date.year(), month: date.month() };
}

export const getYearMonthProps = function (props) {
  const { selectionType, value, initialYear, initialMonth } = props;
  if (!(moment.isMoment(value) || isMomentRange(value))) {
    return { year: initialYear, month: initialMonth };
  }

  if (selectionType === 'single') {
    return getYearMonth(value);
  }

  return getYearMonth(moment(value.start).add(1, 'M'));
};

export const getOptionalYearProps = function (props) {
  const { preventMoveOnCompleteRange, initialYear, initialMonth } = props;
  return preventMoveOnCompleteRange ? { year: initialYear, month: initialMonth } : getYearMonthProps(props);
};
