
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

const SVGNS = 'http://www.w3.org/2000/svg';

export class VpSelection {

  private svg: SVGElement;
  private diagram: any;

  constructor(svg: SVGElement, diagram) {

    this.svg = svg;
    this.diagram = diagram;

    if (diagram.shapes && diagram.enableSelection) {
      this.svg.addEventListener('click', () => {
        this.setSelection(null);
      });

      for (const shapeId in this.diagram.shapes) {

        const info = this.diagram.shapes[shapeId];
        if (info.DefaultLink
          || info.Props && Object.keys(info.Props).length
          || info.Links && info.Links.length
          || info.Comment || info.PopoverMarkdown || info.SidebarMarkdown || info.TooltipMarkdown
        ) {
          const shape = this.findTargetShape(shapeId);
          if (!shape)
            return;

          shape.style.cursor = 'pointer';

          shape.addEventListener('click', (evt) => {
            evt.stopPropagation();
            this.setSelection(shapeId);
          });
        }
      }
    }
  }

  //TODO: consolidate when migrating from jQuery
  private findTargetShape(shapeId: string): any {
    const shape = document.getElementById(shapeId);

    const info = this.diagram.shapes[shapeId];
    if (!info || !info.IsContainer)
      return shape;

    if (!info.ContainerText)
      return null;

    for (let i = 0; i < shape.children.length; ++i) {
      const child = shape.children[i];
      if (child.textContent.indexOf(info.ContainerText) >= 0)
        return child;
    }
  }

  private deselectBox() {
    const hoverBox = document.getElementById("vp-hover-box");
    if (hoverBox) {
      hoverBox.parentNode.removeChild(hoverBox);
    }
    const selectionBox = document.getElementById("vp-selection-box");
    if (selectionBox) {
      selectionBox.parentNode.removeChild(selectionBox);
    }
  }

  public setSelection(shapeId: string) {

    if (this.diagram.selectedShapeId && this.diagram.selectedShapeId !== shapeId) {

      const selectedShape = this.findTargetShape(this.diagram.selectedShapeId);
      if (selectedShape) {
        if (this.diagram.selectionView && this.diagram.selectionView.enableBoxSelection) {
          this.deselectBox();
        } else {
          selectedShape.removeAttribute('filter');
        }
      }

      delete this.diagram.selectedShapeId;
    }

    if (!this.diagram.selectedShapeId || this.diagram.selectedShapeId !== shapeId) {

      this.diagram.selectedShapeId = shapeId;
      this.diagram.selectionChanged.fire(shapeId);

      const shapeToSelect = this.findTargetShape(shapeId);
      if (shapeToSelect) {
        if (this.diagram.selectionView && this.diagram.selectionView.enableBoxSelection) {

          this.deselectBox();

          const rect = shapeToSelect.getBBox();
          let x = rect.x;
          let y = rect.y;
          let width = rect.width;
          let height = rect.height;
          const dilate = +this.diagram.selectionView?.dilate || 4;

          if (this.diagram.enableDilate) {
            x -= dilate / 2;
            width += dilate;
            y -= dilate / 2;
            height += dilate;
          }

          const selectColor = this.diagram.selectionView?.selectColor || "rgba(255, 255, 0, 0.4)";

          const box = document.createElementNS(SVGNS, "rect");
          box.id = "vp-selection-box";
          box.setAttribute("x", x);
          box.setAttribute("y", y);
          box.setAttribute("width", width);
          box.setAttribute("height", height);
          box.style.fill = (this.diagram.selectionView?.mode === 'normal') ? 'none' : selectColor;
          box.style.stroke = selectColor;
          box.style.strokeWidth = `${dilate || 0}px`;
          shapeToSelect.appendChild(box);
        } else {
          shapeToSelect.setAttribute('filter', 'url(#select)');
        }
      }
    }
  }

  public highlightShape(shapeId) {
    this.svg.ownerDocument.getElementById(shapeId).animate([
      { opacity: 1, easing: 'ease-out' },
      { opacity: 0.1, easing: 'ease-in' },
      { opacity: 0 }],
      2000);
    this.setSelection(shapeId);
  }
}
