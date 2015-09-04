import lightenDarkenColor from '../lightenDarkenColor.js';

describe('lightenDarkenColor', function () {

  it('returns colors using the # symbol if the input included one', () => {
  });

  it('returns colors not using the # symbol if the input did not include one', () => {
    expect(lightenDarkenColor('333333', 0)).toBe('333333');
  });

  it('lighten the colors if provided with a positive number', () => {
    expect(lightenDarkenColor('#333333', 5)).toBe('#383838');
  });

  it('caps value if one of the rgb compoents goes over 255', () => {
    expect(lightenDarkenColor('#fe3333', 5)).toBe('#ff3838');
  });

  it('darken the colors if provided with a negative number', () => {
    expect(lightenDarkenColor('#333333', -5)).toBe('#2e2e2e');
  });

  it('caps value if one of the rgb compoents goes under 0', () => {
    expect(lightenDarkenColor('#330233', -5)).toBe('#2e002e');
  });

});
