import lightenDarkenColor from '../lightenDarkenColor';

describe('lightenDarkenColor', function () {

  it('returns colors using the # symbol if the input included one', function () {
  });

  it('returns colors not using the # symbol if the input did not include one', function () {
    expect(lightenDarkenColor('333333', 0)).toBe('333333');
  });

  it('lighten the colors if provided with a positive number', function () {
    expect(lightenDarkenColor('#333333', 5)).toBe('#383838');
  });

  it('caps value if one of the rgb compoents goes over 255', function () {
    expect(lightenDarkenColor('#fe3333', 5)).toBe('#ff3838');
  });

  it('darken the colors if provided with a negative number', function () {
    expect(lightenDarkenColor('#333333', -5)).toBe('#2e2e2e');
  });

  it('caps value if one of the rgb compoents goes under 0', function () {
    expect(lightenDarkenColor('#330233', -5)).toBe('#2e002e');
  });

});
