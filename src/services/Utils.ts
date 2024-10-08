
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { IShapeInfo } from '../interfaces/IShapeInfo';
import { ISvgPublishContext } from "../interfaces/ISvgPublishContext";

export class Utils {

  public static generateUniqueId() {
    return Math.random().toString(36).substring(2, 9)
  }

  public static getValueOrDefault<T>(val: T, def: T) {
    return typeof val === 'undefined' ? def : val;
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
