import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

export default function (previousValue, nextValue) {
  const areBothMoment = moment.isMoment(previousValue) && moment.isMoment(nextValue);
  if (!areBothMoment) {
    return false;
  }

  return previousValue.isSame(nextValue);
}
