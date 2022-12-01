import { ISvgPublishContext } from './interfaces/ISvgPublishContext';
import { View } from './services/View';
import { Selection } from './services/Selection';
import { Links } from './services/Links';
import { Hover } from './services/Hover';
import { Hash } from './services/Hash';

export class SvgPublishContext {

  public static create(container: HTMLElement, content: string): ISvgPublishContext {

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/xml');

    const diagramNode = doc.documentElement.getElementsByTagNameNS("http://vispublish", "SvgPublishData")[0];
    const diagram = diagramNode && JSON.parse(diagramNode.innerHTML);

    const viewBox = diagram.viewBox || doc.documentElement.getAttribute('viewBox');
    doc.documentElement.removeAttribute('viewBox');
    doc.documentElement.setAttribute('width', '100%');
    doc.documentElement.setAttribute('height', '100%');

    container.innerHTML = doc.documentElement.outerHTML;
    const svg = container.querySelector('svg');

    const context: ISvgPublishContext = {
      svg,
      container,
      diagram,
      events: new EventTarget,
      selectedShapeId: undefined,
      services: {},
    };

    context.services['view'] = new View(context, viewBox);

    if (context.diagram.enableSelection) {
      context.services['selection'] = new Selection(context);
    }

    if (context.diagram.enableLinks) {
      context.services['links'] = new Links(context);
    }

    if (context.diagram.enableHover) {
      context.services['hover'] = new Hover(context);
    }

    if (context.diagram.enableHash) {
      context.services['hash'] = new Hash(context);
    }

    return context;
  }

  public static destroy(context: ISvgPublishContext) {
    for (const serviceKey in context.services) {
      const service = context.services[serviceKey];
      service.destroy();
    }
    context.container.innerHTML = '';
  }

}
