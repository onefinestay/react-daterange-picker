import areMomentRangesEqual from '../areMomentRangesEqual.js';
import moment from 'moment';
import {} from 'moment-range';

describe('areMomentRangesEqual', function () {

  it('returns true if the two ranges start and finish on the same day', () => {
    var start = new Date(2012, 0, 15);
    var end   = new Date(2012, 4, 23);
    var range1 = moment.range(start, end);
    var range2 = moment.range(start, end);
    expect(areMomentRangesEqual(range1, range2)).toBe(true);
  });

  it('returns false if the two ranges start on the same day but finish on different days', () => {
    var start = new Date(2012, 0, 15);
    var end1   = new Date(2012, 4, 23);
    var end2   = new Date(2012, 4, 24);
    var range1 = moment.range(start, end1);
    var range2 = moment.range(start, end2);
    expect(areMomentRangesEqual(range1, range2)).toBe(false);
  });

  it('returns false if the two ranges finish on the same day but start on different days', () => {
    var start1 = new Date(2012, 0, 15);
    var start2 = new Date(2012, 0, 16);
    var end   = new Date(2012, 4, 23);
    var range1 = moment.range(start1, end);
    var range2 = moment.range(start2, end);
    expect(areMomentRangesEqual(range1, range2)).toBe(false);
  });

  it('returns false if the two ranges start and finish on different days', () => {
    var start1 = new Date(2012, 0, 15);
    var start2 = new Date(2012, 0, 16);
    var end1   = new Date(2012, 4, 23);
    var end2   = new Date(2012, 4, 24);
    var range1 = moment.range(start1, end1);
    var range2 = moment.range(start2, end2);
    expect(areMomentRangesEqual(range1, range2)).toBe(false);
  });

});
