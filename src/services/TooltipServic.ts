
import { marked } from 'marked';
import Mustache from 'mustache';
import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';
import { BasicService } from './BasicService';
import { Utils } from './Utils';
import { ITooltipService } from '../interfaces/ITooltipService';

import tippy, { Instance, followCursor } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import 'tippy.js/themes/light-border.css';
import 'tippy.js/themes/translucent.css';

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

    tippy.setDefaultProps({
      allowHTML: true,
      interactive: diagram.tooltipInteractive,
      delay: diagram.tooltipDelay ? [diagram.tooltipDelayShow ?? undefined, diagram.tooltipDelayHide ?? undefined] : undefined,
      trigger: diagram.tooltipTrigger,
      placement: diagram.tooltipPlacement,
      followCursor: diagram.tooltipUseMousePosition,
      appendTo: this.context.container,
      plugins: diagram.tooltipUseMousePosition ? [followCursor] : [],
      theme: diagram.tooltipTheme,
    });

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
      });

      this.tooltips.push(instance);
    }
  }
}
