import areMomentValuesEqual from '../areMomentValuesEqual';
import moment from '../../moment-range';

describe('areMomentValuesEqual', function () {
  const today = () => moment("2014-06-01T12:00:00Z");

  describe('when either value is not a moment instance', function () {
    beforeEach(function () {
      this.validDate = today();
    });

    it('returns false if the first value is not a moment instance', function () {
      expect(areMomentValuesEqual(undefined, this.validDate)).toBe(false);
    });

    it('returns false if the first second is not a moment instance', function () {
      expect(areMomentValuesEqual(this.validDate, undefined)).toBe(false);
    });

    it('returns false if either values are not a moment instance', function () {
      expect(areMomentValuesEqual(undefined, undefined)).toBe(false);
    });
  });

  describe('when both values are moment instances', function (){
    it('returns true on the same day', function () {
      const value = today();
      expect(areMomentValuesEqual(value, value.clone())).toBe(true);
    });

    it('returns false on difference days', function () {
      expect(areMomentValuesEqual(today(), today().add(1, 'day'))).toBe(false);
    });
  });
});
