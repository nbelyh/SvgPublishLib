
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ISvgPublishContext } from "../interfaces/ISvgPublishContext";
import { ISelectionChangedEventData, SelectionChangedEvent } from '../events/SelectionChangedEvent';
import { SvgFilters } from './SvgFilters';
import { Utils } from './Utils';
import { BasicService } from './BasicService';
import { ISelectionService } from '../interfaces/ISelectionService';
import { Defaults } from './Defaults';

export class SelectionService extends BasicService implements ISelectionService {

  public selectedShapeId: string = null;
  public enableBoxSelection: boolean = false;

  constructor(context: ISvgPublishContext) {
    super(context);
    this.reset();
  }

  public reset() {

    this.unsubscribe();

    const selectedShapeId = this.selectedShapeId;
    if (selectedShapeId) {
      this.clearSelection();
    }

    const diagram = this.context.diagram;
    const selectionView = diagram.selectionView;

    this.enableBoxSelection = Utils.getValueOrDefault(selectionView?.enableBoxSelection, false);

    const svgFilterDefaults = Defaults.getSvgFilterDefaults(selectionView);

    SvgFilters.createFilterNode(this.context.svg, this.context.guid, Defaults.getSelectionFilterId(this.context.guid), {
      ...svgFilterDefaults,
      color: selectionView?.selectColor ?? Defaults.selectionColor
    });

    const clearSelection = (evt: MouseEvent) => {
      evt.stopPropagation();
      this.setSelection(null, evt);
    }

    this.subscribe(this.context.svg, 'click', clearSelection);

    for (const shapeId in diagram.shapes) {

      const info = diagram.shapes[shapeId];
      if (Utils.isShapeInteractive(info)) {

        const shape = Utils.findTargetElement(shapeId, this.context);
        if (!shape)
          return;

        shape.style.cursor = 'pointer';

        const setSelection = (evt: MouseEvent) => {
          evt.stopPropagation();
          this.setSelection(shapeId, evt);
        }

        this.subscribe(shape, 'click', setSelection);
      }
    }

    if (selectedShapeId) {
      this.setSelection(selectedShapeId);
    }
  }

  private deselectBox() {
    const hoverBox = document.getElementById(Defaults.getHoverBoxId(this.context.guid));
    if (hoverBox) {
      hoverBox.parentNode.removeChild(hoverBox);
    }
    const selectionBox = document.getElementById(Defaults.getSelectionBoxId(this.context.guid));
    if (selectionBox) {
      selectionBox.parentNode.removeChild(selectionBox);
    }
  }

  public destroy(): void {
    this.deselectBox();
    const filterNode = document.getElementById("vp-filter-defs");
    if (filterNode) {
      filterNode.parentNode.removeChild(filterNode);
    }
    this.clearSelection();
    super.destroy();
  }

  public clearSelection() {
    const selectedShape = Utils.findTargetElement(this.selectedShapeId, this.context);
    if (selectedShape) {
      if (this.enableBoxSelection) {
        this.deselectBox();
      } else {
        selectedShape.removeAttribute('filter');
      }
    }

    delete this.selectedShapeId;
  }

  public setSelection(shapeId: string, evt?: Event) {

    const diagram = this.context.diagram;

    if (this.selectedShapeId && this.selectedShapeId !== shapeId) {
      this.clearSelection();
    }

    if (!this.selectedShapeId || this.selectedShapeId !== shapeId) {

      this.selectedShapeId = shapeId;
      const selectionChangedEvent = new CustomEvent<ISelectionChangedEventData>('selectionChanged', {
        cancelable: false,
        detail: {
          triggerEvent: evt,
          context: this.context,
          shapeId
        }
      });

      if (!this.context.events.dispatchEvent(selectionChangedEvent))
        return;

      const shapeToSelect = Utils.findTargetElement(shapeId, this.context);
      if (shapeToSelect) {
        const selectionView = diagram.selectionView;
        if (this.enableBoxSelection) {

          this.deselectBox();

          const rect = shapeToSelect.getBBox();
          const options = {
            color: selectionView.selectColor || Defaults.selectionColor,
            dilate: selectionView.dilate || 4,
            enableDilate: selectionView.enableDilate,
            mode: selectionView.mode
          };

          const box = SvgFilters.createSelectionBox(Defaults.getSelectionBoxId(this.context.guid), rect, options);
          shapeToSelect.appendChild(box);
        } else {
          shapeToSelect.setAttribute('filter', `url(#${Defaults.getSelectionFilterId(this.context.guid)})`);
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
