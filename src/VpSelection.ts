
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { IDiagram } from './interfaces/IDiagram';
import { SelectionChangedEvent } from './interfaces/SelectionChangedEvent';
import { SvgFilterService } from './SvgFilterService';

export class VpSelection {

  private svg: SVGSVGElement;
  private diagram: IDiagram;

  constructor(svg: SVGSVGElement, diagram: IDiagram) {

    this.svg = svg;
    this.diagram = diagram;
    this.diagram.events = new EventTarget();

    SvgFilterService.createFilterDefs(svg, diagram.selectionView);

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
      this.diagram.events.dispatchEvent(new SelectionChangedEvent(shapeId));

      const shapeToSelect = this.findTargetShape(shapeId);
      if (shapeToSelect) {
        if (this.diagram.selectionView && this.diagram.selectionView.enableBoxSelection) {

          this.deselectBox();

          const rect = shapeToSelect.getBBox();
          const box = SvgFilterService.createSelectionBox(rect, this.diagram.selectionView);
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
