
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ISvgPublishContext } from "../interfaces/ISvgPublishContext";
import { ISelectionChangedEventData, SelectionChangedEvent } from '../events/SelectionChangedEvent';
import { Utils } from './Utils';
import { BasicService } from './BasicService';
import { ISelectionService } from '../interfaces/ISelectionService';
import { SelectionUtils } from './SelectionUtils';
import { DefaultColors } from '../constants/DefaultColors';

export class SelectionService extends BasicService implements ISelectionService {

  public selectedShapeId: string = null;
  public highlightedShapeIds: { [shapeId: string]: string } = {};

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

    SelectionUtils.destroySelectionFilters(this.context);
    SelectionUtils.createSelectionFilters(this.context, diagram.selectionView);

    this.subscribe(this.context.svg, 'click', (evt: MouseEvent) => {
      evt.stopPropagation();
      this.setSelection(null, evt);
    });

    for (const shapeId in diagram.shapes) {
      const info = diagram.shapes[shapeId];
      if (info.DefaultLink
        || info.Props && Object.keys(info.Props).length
        || info.Links?.length
        || info.Comment || info.PopoverMarkdown || info.SidebarMarkdown || info.TooltipMarkdown
        || diagram.selectionView?.enableNextShapeColor && info.ConnectedTo?.length
        || diagram.selectionView?.enablePrevShapeColor && info.ConnectedFrom?.length
      ) {
        {
          const shape = Utils.findTargetElement(shapeId, this.context);
          if (shape) {
            shape.style.cursor = 'pointer';

            this.subscribe(shape, 'click', (evt: MouseEvent) => {
              evt.stopPropagation();
              this.setSelection(shapeId, evt);
            });
          }
        }
      }
    }

    if (selectedShapeId) {
      this.setSelection(selectedShapeId);
    }
  }

  public destroy(): void {
    SelectionUtils.destroySelectionFilters(this.context);
    this.clearSelection();
    super.destroy();
  }

  public setSelection(shapeId: string, evt?: Event) {

    const diagram = this.context.diagram;

    if (this.selectedShapeId && this.selectedShapeId !== shapeId) {

      const selectedShape = Utils.findTargetElement(this.selectedShapeId, this.context);
      if (selectedShape) {
        SelectionUtils.removeShapeHighlight(selectedShape, SelectionUtils.getSelectionBoxId(this.context.guid, this.selectedShapeId), this.context);
        delete this.highlightedShapeIds[this.selectedShapeId];
        const info = diagram.shapes[this.selectedShapeId];

        if (diagram.selectionView && (diagram.selectionView.enableNextShapeColor || diagram.selectionView.enableNextConnColor) && info.ConnectedTo) {
          for (let item of info.ConnectedTo) {
            if (diagram.selectionView.enableNextShapeColor) {
              const sid = Utils.findTargetElement(item.sid, this.context);
              SelectionUtils.removeShapeHighlight(sid, SelectionUtils.getSelectionBoxId(this.context.guid, item.sid), this.context);
              delete this.highlightedShapeIds[item.sid];
            }

            if (diagram.selectionView.enableNextConnColor) {
              const cid = Utils.findTargetElement(item.cid, this.context);
              SelectionUtils.removeConnHighlight(cid, this.context);
              delete this.highlightedShapeIds[item.cid];
            }


          }
        }

        if (diagram.selectionView && (diagram.selectionView.enablePrevShapeColor || diagram.selectionView.enablePrevConnColor) && info.ConnectedFrom) {
          for (let item of info.ConnectedFrom) {
            if (diagram.selectionView.enablePrevShapeColor) {
              const sid = Utils.findTargetElement(item.sid, this.context);
              SelectionUtils.removeShapeHighlight(sid, SelectionUtils.getSelectionBoxId(this.context.guid, item.sid), this.context);
              delete this.highlightedShapeIds[item.sid];
            }

            if (diagram.selectionView.enablePrevConnColor) {
              const cid = Utils.findTargetElement(item.cid, this.context);
              SelectionUtils.removeConnHighlight(cid, this.context);
              delete this.highlightedShapeIds[item.cid];
            }
          }
        }
      }

      delete this.selectedShapeId;
    }

    if (!this.selectedShapeId || this.selectedShapeId !== shapeId) {

      this.selectedShapeId = shapeId;
      this.highlightedShapeIds = {};

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
        const info = diagram.shapes[shapeId];

        if (diagram.selectionView && (diagram.selectionView.enableNextShapeColor || diagram.selectionView.enableNextConnColor) && info.ConnectedTo) {
          for (const item of info.ConnectedTo) {
            if (diagram.selectionView.enableNextShapeColor) {
              const nextColor = Utils.getValueOrDefault(diagram.selectionView?.nextShapeColor, DefaultColors.nextShapeColor);
              const sid = Utils.findTargetElement(item.sid, this.context);
              const id = SelectionUtils.getSelectionBoxId(this.context.guid, item.sid);
              SelectionUtils.setShapeHighlight(sid, id,
                SelectionUtils.getNextShapeFilterId(this.context.guid),
                nextColor,
                this.context);
              this.highlightedShapeIds[item.sid] = id;
            }

            if (diagram.selectionView.enableNextConnColor) {
              const connColor = Utils.getValueOrDefault(diagram.selectionView?.nextConnColor, DefaultColors.nextConnColor);
              const cid = Utils.findTargetElement(item.cid, this.context);
              const id = SelectionUtils.setConnHighlight(cid, connColor, this.context);
              this.highlightedShapeIds[item.cid] = id;
            }
          }
        }

        if (diagram.selectionView && (diagram.selectionView.enablePrevShapeColor || diagram.selectionView.enablePrevConnColor) && info.ConnectedFrom) {
          for (const item of info.ConnectedFrom) {

            if (diagram.selectionView.enablePrevShapeColor) {
              const prevColor = Utils.getValueOrDefault(diagram.selectionView?.prevShapeColor, DefaultColors.prevShapeColor);
              const sid = Utils.findTargetElement(item.sid, this.context);
              const id = SelectionUtils.getSelectionBoxId(this.context.guid, item.sid);
              SelectionUtils.setShapeHighlight(sid, id,
                SelectionUtils.getPrevShapeFilterId(this.context.guid),
                prevColor,
                this.context);
              this.highlightedShapeIds[item.sid] = id;
            }

            if (diagram.selectionView.enablePrevConnColor) {
              const connColor = Utils.getValueOrDefault(diagram.selectionView?.prevConnColor, DefaultColors.prevConnColor);
              const cid = Utils.findTargetElement(item.cid, this.context);
              const id = SelectionUtils.setConnHighlight(cid, connColor, this.context);
              this.highlightedShapeIds[item.cid] = id;
            }
          }
        }

        const selectColor = diagram.selectionView && diagram.selectionView.selectColor || DefaultColors.selectionColor;
        const id = SelectionUtils.getSelectionBoxId(this.context.guid, shapeId);
        SelectionUtils.setShapeHighlight(shapeToSelect, id,
          SelectionUtils.getSelectionFilterId(this.context.guid),
          selectColor,
          this.context);
        this.highlightedShapeIds[shapeId] = id;
      }
    }
  }

  public clearSelection() {
    for (const shapeId in this.highlightedShapeIds) {
      const selectedElem = this.context.svg.getElementById(this.highlightedShapeIds[shapeId]);
      if (selectedElem) {
        selectedElem.parentElement.removeChild(selectedElem);
      }
      const shape = this.context.svg.getElementById(shapeId);
      if (shape) {
        shape.removeAttribute('filter');
      }
    }
    this.selectedShapeId = null;
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
