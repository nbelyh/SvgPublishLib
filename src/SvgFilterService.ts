import { ISelectionViewOptions } from "./interfaces/ISelectionViewOptions";

const SVGNS = 'http://www.w3.org/2000/svg';

export class SvgFilterService {

  private static colorToRGBA(input: string) {

    var matchRGBA = /rgba\((\d{1,3}), (\d{1,3}), (\d{1,3}), ([\d|\.]+)\)/.exec(input);
    if (matchRGBA) {
      return {
        r: parseInt(matchRGBA[1]),
        g: parseInt(matchRGBA[2]),
        b: parseInt(matchRGBA[3]),
        a: parseFloat(matchRGBA[4])
      }
    }

    var matchRGB = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/.exec(input);
    if (matchRGB) {
      return {
        r: parseInt(matchRGB[1]),
        g: parseInt(matchRGB[2]),
        b: parseInt(matchRGB[3]),
        a: 1
      }
    }
    
    var matchHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(input);
    if (matchHex) {
      return {
        r: parseInt(matchHex[1], 16),
        g: parseInt(matchHex[2], 16),
        b: parseInt(matchHex[3], 16),
        a: 1
      }
    }
    return null;
  }

  public static createSelectionBox(rect, options: ISelectionViewOptions) {
    let x = rect.x;
    let y = rect.y;
    let width = rect.width;
    let height = rect.height;
    const dilate = +options.dilate || 4;

    if (options?.enableDilate) {
      x -= dilate / 2;
      width += dilate;
      y -= dilate / 2;
      height += dilate;
    }

    const selectColor = options?.selectColor || "rgba(255, 255, 0, 0.4)";

    const box = document.createElementNS(SVGNS, "rect");
    box.id = "vp-selection-box";
    box.setAttribute("x", x);
    box.setAttribute("y", y);
    box.setAttribute("width", width);
    box.setAttribute("height", height);
    box.style.fill = (options?.mode === 'normal') ? 'none' : selectColor;
    box.style.stroke = selectColor;
    box.style.strokeWidth = `${dilate || 0}px`;
  }

  public static createFilterDefs(svg: SVGSVGElement, options: ISelectionViewOptions) {
    const defsNode = document.createElementNS(SVGNS, "defs");
    defsNode.appendChild(this.createFilterNode("hover", options.hoverColor, options));
    defsNode.appendChild(this.createFilterNode("select", options.selectColor, options));
    defsNode.appendChild(this.createFilterNode("hyperlink", options.hyperlinkColor, options));
    svg.appendChild(defsNode);
  }

  public static createFilterNode(id: string, color: string, options?: ISelectionViewOptions) {
    const filterNode = document.createElementNS(SVGNS, "filter");
    filterNode.setAttribute('id', id);

    if (options?.enableDilate) {
      const feMorphology = document.createElementNS(SVGNS, "feMorphology");
      feMorphology.setAttribute("operator", "dilate");
      feMorphology.setAttribute("radius", '' + options.dilate);
      filterNode.appendChild(feMorphology);
    }

    if (options?.enableBlur) {
      const feGaussianBlur = document.createElementNS(SVGNS, "feGaussianBlur");
      feGaussianBlur.setAttribute("stdDeviation", '' + options.blur);
      filterNode.appendChild(feGaussianBlur);
    }

    const feColorMatrixNode = document.createElementNS(SVGNS, "feColorMatrix");
    feColorMatrixNode.setAttribute('type', 'matrix');

    const c = SvgFilterService.colorToRGBA(color);
    feColorMatrixNode.setAttribute('values', `
      ${c.r} ${c.r} ${c.r} ${c.r} ${c.r}
      ${c.g} ${c.g} ${c.g} ${c.g} ${c.g}
      ${c.b} ${c.b} ${c.b} ${c.b} ${c.b}
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