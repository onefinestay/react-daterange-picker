import isMomentRange from '../isMomentRange';
import moment from 'moment';

describe('isMomentRange', function () {

  it('returns false if no value is provided', function () {
    expect(isMomentRange()).toBe(undefined);
  });

  it('returns false if there is no start value', function () {
    expect(isMomentRange({end: 'a'})).toBe(undefined);
  });

  it('returns false if there is no end value', function () {
    expect(isMomentRange({start: 'a'})).toBe(undefined);
  });

  it('returns false is the start value is not a moment value', function () {
    expect(isMomentRange({start: 'a', end: 'a'})).toBe(false);
  });

  it('returns false is the end value is not a moment value', function () {
    expect(isMomentRange({start: moment(), end: 'a'})).toBe(false);
  });

  it('return true otherwise', function () {
    expect(isMomentRange({start: moment(), end: moment()})).toBe(true);
  });

});
