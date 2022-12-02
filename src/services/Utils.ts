
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { IShapeInfo } from '../interfaces/IShapeInfo';
import { ISvgPublishContext } from "../interfaces/ISvgPublishContext";

export class Utils {

  public static isShapeInteractive(info: IShapeInfo) {
    return info.DefaultLink
      || info.Props && Object.keys(info.Props).length
      || info.Links && info.Links.length
      || info.Comment || info.PopoverMarkdown || info.SidebarMarkdown || info.TooltipMarkdown
  }

  public static findTargetElement(id: string, context: ISvgPublishContext): SVGGElement {

    const elt = context.svg.getElementById(id);

    const info = context.diagram.shapes[id];
    if (!info || !info.IsContainer)
      return elt as SVGGElement;

    if (!info.ContainerText)
      return null;

    for (let i = 0; i < elt.children.length; ++i) {
      const child = elt.children[i];
      if (child.textContent.indexOf(info.ContainerText) >= 0)
        return child as SVGGElement;
    }
  }
}
