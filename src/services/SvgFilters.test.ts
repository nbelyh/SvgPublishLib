import { SvgFilters } from './SvgFilters';

test('colorToRGBA', () => {
  expect(SvgFilters.colorToRGBA(`rgba(0, 0, 0, 0)`)).toEqual({ r: 0, g: 0, b: 0, a: 0 });
  expect(SvgFilters.colorToRGBA(`rgba(255, 255, 255, 1)`)).toEqual({ r: 1, g: 1, b: 1, a: 1 });
  expect(SvgFilters.colorToRGBA(`rgba(255, 255, 255, 0.5)`)).toEqual({ r: 1, g: 1, b: 1, a: 0.5 });
  expect(SvgFilters.colorToRGBA(`rgba(255, 0, 0, 0.8)`)).toEqual({ r: 1, g: 0, b: 0, a: 0.8 });

  expect(SvgFilters.colorToRGBA(`rgba(0x00, 0x00, 0x00, 0)`)).toEqual({ r: 0, g: 0, b: 0, a: 0 });
  expect(SvgFilters.colorToRGBA(`rgba(0xFF, 0xFF, 0xFF, 1)`)).toEqual({ r: 1, g: 1, b: 1, a: 1 });
  expect(SvgFilters.colorToRGBA(`rgba(0xFF, 0xFF, 0xFF, 0.5)`)).toEqual({ r: 1, g: 1, b: 1, a: 0.5 });
  expect(SvgFilters.colorToRGBA(`rgba(0xFF, 0x00, 0x00, 0.8)`)).toEqual({ r: 1, g: 0, b: 0, a: 0.8 });
});
