import isMomentRange from '../isMomentRange.js';
import moment from 'moment';

describe('isMomentRange', function () {

  it('returns false if no value is provided', () => {
    expect(isMomentRange()).toBe(undefined);
  });

  it('returns false if there is no start value', () => {
    expect(isMomentRange({end: 'a'})).toBe(undefined);
  });

  it('returns false if there is no end value', () => {
    expect(isMomentRange({start: 'a'})).toBe(undefined);
  });

  it('returns false is the start value is not a moment value', () => {
    expect(isMomentRange({start: 'a', end: 'a'})).toBe(false);
  });

  it('returns false is the end value is not a moment value', () => {
    expect(isMomentRange({start: moment(), end: 'a'})).toBe(false);
  });

  it('return true otherwise', () => {
    expect(isMomentRange({start: moment(), end: moment()})).toBe(true);
  });

});
