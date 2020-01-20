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
  if (!(moment.isMoment(value) || isMomentRange(value) || (Array.isArray(value) && value.length && moment.isMoment(value[0])))) {
    return { year: initialYear, month: initialMonth };
  }

  if (selectionType === 'single') {
    return getYearMonth(value);
  } else if (selectionType === 'multiple') {
    return getYearMonth(value[0]);
  }

  return getYearMonth(value.start);
};
