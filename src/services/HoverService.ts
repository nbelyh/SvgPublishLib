﻿
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';
import { BasicService } from './BasicService';
import { IHoverService } from '../interfaces/IHoverService';
import { Utils } from './Utils';
import { DefaultColors } from '../constants/DefaultColors';
import { SelectionUtils } from './SelectionUtils';

export class HoverService extends BasicService implements IHoverService {

  private enableBoxSelection: boolean = false;

  constructor(context: ISvgPublishContext) {
    super(context);
    this.reset();
  }

  public destroy(): void {
    SelectionUtils.destroyHoverFilters(this.context);
    super.destroy();
  }

  public reset() {

    super.unsubscribe();

    const diagram = this.context.diagram;
    const selectionView = diagram?.selectionView;
    const selectionService = this.context.services.selection;

    SelectionUtils.destroyHoverFilters(this.context);
    SelectionUtils.createHoverFilters(this.context, selectionView);

    for (const shapeId in diagram.shapes) {

      var info = diagram.shapes[shapeId];

      if (info.DefaultLink
        || info.Props && Object.keys(info.Props).length
        || info.Links?.length
        || info.Comment || info.PopoverMarkdown || info.SidebarMarkdown || info.TooltipMarkdown
        || diagram.selectionView?.enableNextShapeColor && info.ConnectedTo?.length
        || diagram.selectionView?.enablePrevShapeColor && info.ConnectedFrom?.length
      ) {

        const boxId = SelectionUtils.getSelectionBoxId(this.context.guid, shapeId);

        const shape = Utils.findTargetElement(shapeId, this.context);
        if (shape) {

          var filter = (diagram.enableFollowHyperlinks && info.DefaultLink)
            ? SelectionUtils.getHyperlinkFilterId(this.context.guid)
            : SelectionUtils.getHoverFilterId(this.context.guid);

          this.subscribe(shape, 'mouseover', () => {
            if (!selectionService?.highlightedShapeIds?.[shapeId]) {
              var hyperlinkColor = Utils.getValueOrDefault(selectionView?.hyperlinkColor, DefaultColors.hyperlinkColor);
              var hoverColor = Utils.getValueOrDefault(selectionView?.hoverColor, DefaultColors.hoverColor);
              var color = (diagram.enableFollowHyperlinks && info.DefaultLink) ? hyperlinkColor : hoverColor;
              SelectionUtils.setShapeHighlight(shape, boxId, filter, color, this.context);
            }
          });

          this.subscribe(shape, 'mouseout', () => {
            if (!selectionService?.highlightedShapeIds[shapeId]) {
              SelectionUtils.removeShapeHighlight(shape, boxId, this.context);
            }
          });
        }
      }
    }
  }
}
