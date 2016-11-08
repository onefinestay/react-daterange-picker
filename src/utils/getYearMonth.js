export function getYearMonth(date) {
  if (!date) {
    return undefined;
  }

  return { year: date.year(), month: date.month() };
}

export const getYearMonthProps = function (props) {
  const { selectionType, value } = props;
  if (!value) {
    return undefined;
  }

  if (selectionType === 'single') {
    return getYearMonth(value);
  }

  return getYearMonth(props.value.start);
};
