import moment from 'moment';
import {} from 'moment-range';

export default function isMomentRange(val) {
  return val && val.start && val.end && moment.isMoment(val.start) && moment.isMoment(val.end);
}
