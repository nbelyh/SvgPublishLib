
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';
import { BasicService } from './BasicService';
import { IHoverService } from '../interfaces/IHoverService';
import { SvgFilters } from './SvgFilters';
import { Utils } from './Utils';
import { Defaults } from './Defaults';

export class HoverService extends BasicService implements IHoverService {

  private enableBoxSelection: boolean = false;

  constructor(context: ISvgPublishContext) {
    super(context);
    this.reset();
  }

  public destroy(): void {
    const hoverFilterNode = document.getElementById(Defaults.getHoverFilterId(this.context.guid));
    if (hoverFilterNode) {
      hoverFilterNode.parentNode.removeChild(hoverFilterNode);
    }
    const hyperlinkFilterNode = document.getElementById(Defaults.getHyperlinkFilterId(this.context.guid));
    if (hyperlinkFilterNode) {
      hyperlinkFilterNode.parentNode.removeChild(hyperlinkFilterNode);
    }
    super.destroy();
  }

  public reset() {

    super.unsubscribe();

    const diagram = this.context.diagram;
    const selectionView = diagram?.selectionView;

    this.enableBoxSelection = Utils.getValueOrDefault(selectionView?.enableBoxSelection, false);

    const svgFilterDefaults = Defaults.getSvgFilterDefaults(selectionView);

    SvgFilters.createFilterNode(this.context.svg, this.context.guid, Defaults.getHoverFilterId(this.context.guid), {
      ...svgFilterDefaults,
      color: Utils.getValueOrDefault(selectionView?.hoverColor, Defaults.hoverColor)
    });

    SvgFilters.createFilterNode(this.context.svg, this.context.guid, Defaults.getHyperlinkFilterId(this.context.guid), {
      ...svgFilterDefaults,
      color: Utils.getValueOrDefault(selectionView?.hyperlinkColor, Defaults.hyperlinkColor)
    });

    for (const shapeId in diagram.shapes) {

      var info = diagram.shapes[shapeId];
      if (Utils.isShapeInteractive(info)) {

        const shape = Utils.findTargetElement(shapeId, this.context);
        if (!shape)
          continue;

        // hover support
        if (this.enableBoxSelection) {

          const hyperlinkColor = selectionView.hyperlinkColor || Defaults.hyperlinkColor;
          const hoverColor = selectionView.hoverColor || Defaults.hoverColor;

          var rect = shape.getBBox();
          const options = {
            color: (diagram.enableFollowHyperlinks && info.DefaultLink) ? hyperlinkColor : hoverColor,
            dilate: selectionView.dilate,
            enableDilate: selectionView.enableDilate,
            mode: selectionView.mode
          };

          const box = SvgFilters.createSelectionBox(Defaults.getHoverBoxId(this.context.guid), rect, options);

          const onMouseOver = () => {
            if (this.context.services.selection?.selectedShapeId !== shapeId) {
              shape.appendChild(box);
            }
          };

          const onMouseOut = () => {
            if (this.context.services.selection?.selectedShapeId !== shapeId) {
              var box = document.getElementById(Defaults.getHoverBoxId(this.context.guid));
              if (box) {
                box.parentNode.removeChild(box);
              }
            }
          };

          this.subscribe(shape, 'mouseover', onMouseOver);
          this.subscribe(shape, 'mouseout', onMouseOut);
        } else {

          const filter = (diagram.enableFollowHyperlinks && info.DefaultLink)
            ? `url(#${Defaults.getHyperlinkFilterId(this.context.guid)})`
            : `url(#${Defaults.getHoverFilterId(this.context.guid)})`;

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
