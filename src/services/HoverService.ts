
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';
import { BasicService } from './BasicService';
import { IHoverService } from '../interfaces/IHoverService';
import { SvgFilters } from './SvgFilters';
import { Utils } from './Utils';

export class HoverService extends BasicService implements IHoverService {

  constructor(context: ISvgPublishContext) {
    super(context);

    const diagram = this.context.diagram;

    for (const shapeId in diagram.shapes) {

      var info = diagram.shapes[shapeId];
      if (Utils.isShapeInteractive(info)) {
        const shape = Utils.findTargetElement(shapeId, this.context);
        if (!shape)
          continue;

        // hover support
        const selectionView = diagram.selectionView;
        if (selectionView?.enableBoxSelection) {

          const hyperlinkColor = selectionView.hyperlinkColor || "rgba(0, 0, 255, 0.2)";
          const hoverColor = selectionView.hoverColor || "rgba(255, 255, 0, 0.2)";

          var rect = shape.getBBox();
          const options = {
            color: (diagram.enableFollowHyperlinks && info.DefaultLink) ? hyperlinkColor : hoverColor,
            dilate: selectionView.dilate,
            enableDilate: selectionView.enableDilate,
            mode: selectionView.mode
          };

          const box = SvgFilters.createSelectionBox("vp-hover-box", rect, options);

          const onMouseOver = () => {
            if (this.context.services.selection?.selectedShapeId !== shapeId) {
              shape.appendChild(box);
            }
          };

          const onMouseOut = () => {
            if (this.context.services.selection?.selectedShapeId !== shapeId) {
              var box = document.getElementById("vp-hover-box");
              if (box) {
                box.parentNode.removeChild(box);
              }
            }
          };

          this.subscribe(shape, 'mouseover', onMouseOver);
          this.subscribe(shape, 'mouseout', onMouseOut);
        } else {

          const filter = (diagram.enableFollowHyperlinks && info.DefaultLink) ? 'url(#hyperlink)' : 'url(#hover)';

          const onMouseOver = () => {
            if (this.context.services.selection?.selectedShapeId !== shapeId)
              shape.setAttribute('filter', filter);
          };

          const onMouseOut = () => {
            if (this.context.services.selection?.selectedShapeId !== shapeId)
              shape.removeAttribute('filter');
          };

          this.subscribe(shape, 'mouseover', onMouseOver);
          this.subscribe(shape, 'mouseout', onMouseOut);
        }
      }
    }
  }
}
