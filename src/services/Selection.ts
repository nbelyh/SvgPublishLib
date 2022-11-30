﻿
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { IContext } from "interfaces/IContext";
import { SelectionChangedEvent } from 'events/SelectionChangedEvent';
import { SvgFilters } from './SvgFilters';
import { Utils } from './Utils';
import { BaseFeature } from './BaseFeature';

export class Selection extends BaseFeature {

  constructor(context: IContext) {
    super(context);

    const diagram = this.context.diagram;

    if (diagram.enableSelection) {

      const defsNode = SvgFilters.createFilterDefs(diagram.selectionView);
      context.svg.appendChild(defsNode);

      const clearSelection = (evt: MouseEvent) => {
        evt.stopPropagation();
        this.setSelection(null);
      }

      this.subscribe(this.context.svg, 'click', clearSelection);

      for (const shapeId in diagram.shapes) {

        const info = diagram.shapes[shapeId];
        if (info.DefaultLink
          || info.Props && Object.keys(info.Props).length
          || info.Links && info.Links.length
          || info.Comment || info.PopoverMarkdown || info.SidebarMarkdown || info.TooltipMarkdown
        ) {
          const shape = Utils.findTargetElement(shapeId, context);
          if (!shape)
            return;

          shape.style.cursor = 'pointer';

          const setSelection = (evt: MouseEvent) => {
            evt.stopPropagation();
            this.setSelection(shapeId);
          }

          this.subscribe(shape, 'click', setSelection);
        }
      }
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

    const diagram = this.context.diagram;

    if (this.context.selectedShapeId && this.context.selectedShapeId !== shapeId) {

      const selectedShape = Utils.findTargetElement(this.context.selectedShapeId, this.context);
      if (selectedShape) {
        if (diagram.selectionView && diagram.selectionView.enableBoxSelection) {
          this.deselectBox();
        } else {
          selectedShape.removeAttribute('filter');
        }
      }

      delete this.context.selectedShapeId;
    }

    if (!this.context.selectedShapeId || this.context.selectedShapeId !== shapeId) {

      this.context.selectedShapeId = shapeId;
      if (!this.context.events.dispatchEvent(new SelectionChangedEvent({ shapeId })))
        return;

      const shapeToSelect = Utils.findTargetElement(shapeId, this.context);
      if (shapeToSelect) {
        const selectionView = diagram.selectionView;
        if (selectionView?.enableBoxSelection) {

          this.deselectBox();

          const rect = shapeToSelect.getBBox();
          const options = {
            color: selectionView.selectColor || "rgba(255, 255, 0, 0.4)",
            dilate: selectionView.dilate || 4,
            enableDilate: selectionView.enableDilate,
            mode: selectionView.mode
          };

          const box = SvgFilters.createSelectionBox("vp-selection-box", rect, options);
          shapeToSelect.appendChild(box);
        } else {
          shapeToSelect.setAttribute('filter', 'url(#select)');
        }
      }
    }
  }

  public highlightShape(shapeId: string) {
    this.context.svg.getElementById(shapeId).animate([
      { opacity: 1, easing: 'ease-out' },
      { opacity: 0.1, easing: 'ease-in' },
      { opacity: 0 }],
      2000);
    this.setSelection(shapeId);
  }
}
