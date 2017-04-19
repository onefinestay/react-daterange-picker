import areMomentRangesEqual from '../areMomentRangesEqual';
import moment from '../../moment-range';

describe('areMomentRangesEqual', function () {

  describe('when either value is not a moment range', function () {
    beforeEach(function () {
      const start = new Date(2012, 0, 15);
      const end   = new Date(2012, 4, 23);
      this.validRange = moment.range(start, end);
    });

    it('returns false if the first value is not a moment range', function () {
      expect(areMomentRangesEqual(undefined, this.validRange)).toBe(false);
    });

    it('returns false if the first second is not a moment range', function () {
      expect(areMomentRangesEqual(this.validRange, undefined)).toBe(false);
    });

    it('returns false if either values are not moment ranges', function () {
      expect(areMomentRangesEqual(undefined, undefined)).toBe(false);
    });
  });

  it('returns true if the two ranges start and finish on the same day', function () {
    var start = new Date(2012, 0, 15);
    var end   = new Date(2012, 4, 23);
    var range1 = moment.range(start, end);
    var range2 = moment.range(start, end);
    expect(areMomentRangesEqual(range1, range2)).toBe(true);
  });

  it('returns false if the two ranges start on the same day but finish on different days', function () {
    var start = new Date(2012, 0, 15);
    var end1   = new Date(2012, 4, 23);
    var end2   = new Date(2012, 4, 24);
    var range1 = moment.range(start, end1);
    var range2 = moment.range(start, end2);
    expect(areMomentRangesEqual(range1, range2)).toBe(false);
  });

  it('returns false if the two ranges finish on the same day but start on different days', function () {
    var start1 = new Date(2012, 0, 15);
    var start2 = new Date(2012, 0, 16);
    var end   = new Date(2012, 4, 23);
    var range1 = moment.range(start1, end);
    var range2 = moment.range(start2, end);
    expect(areMomentRangesEqual(range1, range2)).toBe(false);
  });

  it('returns false if the two ranges start and finish on different days', function () {
    var start1 = new Date(2012, 0, 15);
    var start2 = new Date(2012, 0, 16);
    var end1   = new Date(2012, 4, 23);
    var end2   = new Date(2012, 4, 24);
    var range1 = moment.range(start1, end1);
    var range2 = moment.range(start2, end2);
    expect(areMomentRangesEqual(range1, range2)).toBe(false);
  });

});
