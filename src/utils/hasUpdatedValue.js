import areMomentRangesEqual from './areMomentRangesEqual';
import areMomentValuesEqual from './areMomentValuesEqual';

export default function (previousProps, nextProps) {
  const previousValue = previousProps.value;
  const nextValue = nextProps.value;

  return !(
    previousValue === nextValue ||
    areMomentValuesEqual(previousValue, nextValue) ||
    areMomentRangesEqual(previousValue, nextValue)
  );
}
