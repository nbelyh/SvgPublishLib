
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { Defaults } from './Defaults';

const SVGNS = 'http://www.w3.org/2000/svg';

export class SvgFilters {

  private static colorToRGBA(input: string) {

    var matchRGBA = /rgba\((\d{1,3}), (\d{1,3}), (\d{1,3}), ([\d|\.]+)\)/.exec(input);
    if (matchRGBA) {
      return {
        r: parseInt(matchRGBA[1]) / 255,
        g: parseInt(matchRGBA[2]) / 255,
        b: parseInt(matchRGBA[3]) / 255,
        a: parseFloat(matchRGBA[4])
      }
    }

    var matchRGB = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/.exec(input);
    if (matchRGB) {
      return {
        r: parseInt(matchRGB[1]) / 255,
        g: parseInt(matchRGB[2]) / 255,
        b: parseInt(matchRGB[3]) / 255,
        a: 1
      }
    }

    var matchHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(input);
    if (matchHex) {
      return {
        r: parseInt(matchHex[1], 16) / 255,
        g: parseInt(matchHex[2], 16) / 255,
        b: parseInt(matchHex[3], 16) / 255,
        a: 1
      }
    }

    const hslaRegex = /^hsla\(\s*(\d+|\d*\.\d+)\s*,\s*(\d+|\d*\.\d+)%\s*,\s*(\d+|\d*\.\d+)%\s*,\s*(\d+|\d*\.\d+)\s*\)$/;
    if (hslaRegex.test(input)) {

      const [h, s, l, a] = input.match(/\d+(\.\d+)?/g).map((val, index) => {
        return index === 0 ? parseFloat(val) // hue
          : index === 3 ? parseFloat(val) // alpha
            : parseFloat(val) / 100; // saturation and lightness
      });

      let c = (1 - Math.abs(2 * l - 1)) * s;
      let x = c * (1 - Math.abs((h / 60) % 2 - 1));
      let m = l - c / 2;
      let r = 0, g = 0, b = 0;

      if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
      } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
      } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
      } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
      } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
      } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
      }

      return {
        r: r + m,
        g: g + m,
        b: b + m,
        a: a
      }
    }

    return null;
  }

  public static createSelectionBox(id: string, rect, options: { dilate: number; enableDilate: boolean; color: string, mode: string }) {

    let x = rect.x;
    let y = rect.y;
    let width = rect.width;
    let height = rect.height;
    const dilate = options.dilate || 4;

    if (options?.enableDilate) {
      x -= dilate / 2;
      width += dilate;
      y -= dilate / 2;
      height += dilate;
    }

    const box = document.createElementNS(SVGNS, "rect");
    box.id = id;
    box.setAttribute("x", x);
    box.setAttribute("y", y);
    box.setAttribute("width", width);
    box.setAttribute("height", height);
    box.setAttribute("pointer-events", "none");
    box.style.fill = (options.mode === 'normal') ? 'none' : options.color;
    box.style.stroke = options.color;
    box.style.strokeWidth = `${dilate || 0}px`;

    return box;
  }

  public static createFilterNode(svg: SVGSVGElement, guid: string, id: string, options: {
    dilate: number;
    enableDilate: boolean;
    blur: number;
    enableBlur: boolean;
    color: string,
    mode: string
  }) {

    let filterNode = document.getElementById(id) as any;
    if (filterNode) {
      filterNode.parentNode.removeChild(filterNode);
    }

    filterNode = document.createElementNS(SVGNS, "filter");
    filterNode.setAttribute('id', id);

    if (options.enableDilate) {
      const feMorphology = document.createElementNS(SVGNS, "feMorphology");
      feMorphology.setAttribute("operator", "dilate");
      feMorphology.setAttribute("radius", '' + options.dilate);
      filterNode.appendChild(feMorphology);
    }

    if (options.enableBlur) {
      const feGaussianBlur = document.createElementNS(SVGNS, "feGaussianBlur");
      feGaussianBlur.setAttribute("stdDeviation", '' + options.blur);
      filterNode.appendChild(feGaussianBlur);
    }

    const feColorMatrixNode = document.createElementNS(SVGNS, "feColorMatrix");
    feColorMatrixNode.setAttribute('type', 'matrix');

    const c = SvgFilters.colorToRGBA(options.color);
    feColorMatrixNode.setAttribute('values', `
      0 0 0 0 ${c.r}
      0 0 0 0 ${c.g}
      0 0 0 0 ${c.b}
      0 0 0 ${c.a} 0`);
    feColorMatrixNode.setAttribute('result', 'matrix');
    filterNode.appendChild(feColorMatrixNode);

    const feBlend = document.createElementNS(SVGNS, "feBlend");
    feBlend.setAttribute("in", "SourceGraphic");
    feBlend.setAttribute("in2", "matrix");
    feBlend.setAttribute("mode", options.mode);

    filterNode.appendChild(feBlend);

    const defsId = Defaults.getFilterDefsId(guid);
    let defsNode: SVGDefsElement = svg.getElementById(defsId) as any;
    if (!defsNode) {
      defsNode = document.createElementNS(SVGNS, "defs");
      defsNode.id = defsId;
      svg.appendChild(defsNode);
    }
    defsNode.appendChild(filterNode);
  }
}
