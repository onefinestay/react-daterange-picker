import moment from '../momentRange';

export default function (previousValue, nextValue) {
  const areBothMoment = moment.isMoment(previousValue) && moment.isMoment(nextValue);
  if (!areBothMoment) {
    return false;
  }

  return previousValue.isSame(nextValue);
}
