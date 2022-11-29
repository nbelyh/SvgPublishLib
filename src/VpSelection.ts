
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { SelectionChangedEvent } from './interfaces/SelectionChangedEvent';
import { SvgFilterService } from './SvgFilterService';
import { SvgPublish } from './SvgPublish';

export class VpSelection {

  private component: SvgPublish;
  constructor(component: SvgPublish) {

    this.component = component;

    const diagram = this.component.diagram;
    const svg = this.component.svg;

    SvgFilterService.createFilterDefs(svg, diagram.selectionView);

    if (diagram.shapes && diagram.enableSelection) {

      svg.addEventListener('click', () => this.setSelection(null));

      for (const shapeId in diagram.shapes) {

        const info = diagram.shapes[shapeId];
        if (info.DefaultLink
          || info.Props && Object.keys(info.Props).length
          || info.Links && info.Links.length
          || info.Comment || info.PopoverMarkdown || info.SidebarMarkdown || info.TooltipMarkdown
        ) {
          const shape = this.component.findTargetShape(shapeId);
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

  public unsubscribe() {

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

    const diagram = this.component.diagram;

    if (diagram.selectedShapeId && diagram.selectedShapeId !== shapeId) {

      const selectedShape = this.component.findTargetShape(diagram.selectedShapeId);
      if (selectedShape) {
        if (diagram.selectionView && diagram.selectionView.enableBoxSelection) {
          this.deselectBox();
        } else {
          selectedShape.removeAttribute('filter');
        }
      }

      delete diagram.selectedShapeId;
    }

    if (!diagram.selectedShapeId || diagram.selectedShapeId !== shapeId) {

      diagram.selectedShapeId = shapeId;
      diagram.events.dispatchEvent(new SelectionChangedEvent({ shapeId }));

      const shapeToSelect = this.component.findTargetShape(shapeId);
      if (shapeToSelect) {
        if (diagram.selectionView && diagram.selectionView.enableBoxSelection) {

          this.deselectBox();

          const rect = shapeToSelect.getBBox();
          const box = SvgFilterService.createSelectionBox(rect, diagram.selectionView);
          shapeToSelect.appendChild(box);
        } else {
          shapeToSelect.setAttribute('filter', 'url(#select)');
        }
      }
    }
  }

  public highlightShape(shapeId: string) {
    this.component.svg.ownerDocument.getElementById(shapeId).animate([
      { opacity: 1, easing: 'ease-out' },
      { opacity: 0.1, easing: 'ease-in' },
      { opacity: 0 }],
      2000);
    this.setSelection(shapeId);
  }
}
