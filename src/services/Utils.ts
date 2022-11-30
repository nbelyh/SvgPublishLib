import { IContext } from "interfaces/IContext";

export class Utils {

  public static findTargetElement(id: string, context: IContext): SVGGElement {

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
