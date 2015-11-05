export default function areMomentRangesEqual(r1, r2) {
  return r1.start.isSame(r2.start, 'day') && r1.end.isSame(r2.end, 'day');
}
