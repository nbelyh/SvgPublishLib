
import { marked } from 'marked';
import Mustache from 'mustache';
import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';
import { BasicService } from './BasicService';
import { Utils } from './Utils';
import { ITooltipService } from '../interfaces/ITooltipService';

import tippy, { Instance, followCursor } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export class TooltipService extends BasicService implements ITooltipService {

  constructor(context: ISvgPublishContext) {
    super(context);
    this.reset();
  }

  public destroy(): void {
    for (const tooltip of this.tooltips) {
      tooltip.destroy();
    }
    this.tooltips = [];
  }

  tooltips: Instance[] = [];

  public reset() {

    this.destroy();

    const diagram = this.context.diagram;

    if (!diagram.shapes || !diagram.enableTooltips) {
      return;
    }

    for (const shapeId in diagram.shapes) {

      const info = diagram.shapes[shapeId];

      const target = Utils.findTargetElement(shapeId, this.context);
      if (!target)
        continue;

      const tooltipMarkdown = info.TooltipMarkdown || (diagram.enableTooltipMarkdown && diagram.tooltipMarkdown) || info.Comment || '';
      const md = tooltipMarkdown && Mustache.render(tooltipMarkdown, info);
      const content = md && marked.parseInline(md) as string;

      if (!content)
        continue;

      const instance = tippy(target, {
        content: content,
        allowHTML: true,
        interactive: diagram.tooltipInteractive,
        delay: diagram.tooltipDelay ? [diagram.tooltipDelayShow ?? undefined, diagram.tooltipDelayHide ?? undefined] : undefined,
        trigger: diagram.tooltipTrigger,
        placement: diagram.tooltipPlacement,
        followCursor: diagram.tooltipUseMousePosition,
        appendTo: this.context.container,
        plugins: diagram.tooltipUseMousePosition ? [followCursor] : undefined,
      });

      this.tooltips.push(instance);

      // if (diagram.processNested) {
      //   // avoid double-tooltips
      //   $shape.on('show.bs.tooltip', function () {
      //     $shape.parents().tooltip('hide');
      //   });
      // }

      // if (diagram.tooltipUseMousePosition) {

      //   var mouseEvent = {};
      //   $.fn.tooltip.Constructor.prototype.update = function (e) {

      //     mouseEvent.pageX = e.pageX;
      //     mouseEvent.pageY = e.pageY;
      //     var $tip = this.tip();

      //     var pos = this.getPosition()
      //     var actualWidth = $tip[0].offsetWidth
      //     var actualHeight = $tip[0].offsetHeight

      //     var placement = typeof this.options.placement == 'function' ?
      //       this.options.placement.call(this, $tip[0], this.$element[0]) :
      //       this.options.placement

      //     var autoToken = /\s?auto?\s?/i
      //     var autoPlace = autoToken.test(placement)
      //     if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      //     if (autoPlace) {
      //       var orgPlacement = placement
      //       var viewportDim = this.getPosition(this.$viewport)

      //       placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' :
      //         placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' :
      //           placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' :
      //             placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' :
      //               placement

      //       $tip
      //         .removeClass(orgPlacement)
      //         .addClass(placement)
      //     }

      //     var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      //     this.applyPlacement(calculatedOffset, placement)
      //   }

      //   var originalGetPosition = $.fn.tooltip.Constructor.prototype.getPosition;
      //   $.fn.tooltip.Constructor.prototype.getPosition = function ($elem) {
      //     if ($elem || typeof (mouseEvent.pageX) !== 'number' || typeof (mouseEvent.pageY) !== 'number') {
      //       return originalGetPosition.call(this, $elem);
      //     } else {
      //       return {
      //         left: mouseEvent.pageX,
      //         top: mouseEvent.pageY,
      //         width: 1,
      //         height: 1
      //       };
      //     }
      //   };

      //   $shape.on('mousemove', function (e) {
      //     $shape.data('bs.tooltip').update(e);
      //   })
      // }
    }

    // if (diagram.tooltipOutsideClick) {
    //   $('div.svg').mouseup(function (e) {
    //     $.each(diagram.shapes,
    //       function (shapeId) {
    //         var $shape = $("#" + shapeId);
    //         if (!$shape.is(e.target) &&
    //           $shape.has(e.target).length === 0 &&
    //           $('.tooltip').has(e.target).length === 0) {
    //           (($shape.tooltip('hide').data('bs.tooltip') || {}).inState || {}).click = false; // fix for BS 3.3.7
    //         }
    //       });
    //   });
    // }
  }
}
