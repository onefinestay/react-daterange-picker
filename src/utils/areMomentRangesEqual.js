import isMomentRange from './isMomentRange';

export default function areMomentRangesEqual(r1, r2) {
  if (!isMomentRange(r1) || !isMomentRange(r2)) {
    return false;
  }

  return r1.start.isSame(r2.start, 'day') && r1.end.isSame(r2.end, 'day');
}
