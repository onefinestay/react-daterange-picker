import moment from '../moment-range';
import areMomentRangesEqual from './areMomentRangesEqual';
import isMomentRange from './isMomentRange';


function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }
  var key;

  // Test for A's keys different from B.
  for (key in objA) {
    if (objA.hasOwnProperty(key)) {
      if (!objB.hasOwnProperty(key)) {
        return false;
      } else if (
        moment.isMoment(objA[key]) &&
        moment.isMoment(objB[key])
      ) {
        if (!objA[key].isSame(objB[key], 'day')) {
          return false;
        }
      } else if (
        isMomentRange(objA[key]) &&
        isMomentRange(objB[key])
      ) {
        if (!areMomentRangesEqual(objA[key], objB[key])) {
          return false;
        }
      } else if (objA[key] !== objB[key]) {
        return false;
      }
    }
  }

  // Test for B's keys missing from A.
  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

export default shallowEqual;
