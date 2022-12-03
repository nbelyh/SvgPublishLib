
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ISelectionViewOptions } from '../interfaces/ISelectionViewOptions';

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

  public static createFilterDefs(selectionView: ISelectionViewOptions) {
    const defsNode = document.createElementNS(SVGNS, "defs");
    const options = {
      dilate: selectionView.dilate,
      enableDilate: selectionView.enableDilate,
      blur: selectionView.blur,
      enableBlur: selectionView.enableBlur,
      mode: selectionView.mode
    };
    defsNode.appendChild(this.createFilterNode("hover", { ...options, color: selectionView.hoverColor }));
    defsNode.appendChild(this.createFilterNode("select", { ...options, color: selectionView.selectColor }));
    defsNode.appendChild(this.createFilterNode("hyperlink", { ...options, color: selectionView.hyperlinkColor }));
    return defsNode;
  }

  public static createFilterNode(id: string, options: { dilate: number; enableDilate: boolean; blur: number; enableBlur: boolean; color: string, mode: string }) {
    const filterNode = document.createElementNS(SVGNS, "filter");
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

    return filterNode;
  }
}
