import { ISvgPublishContext } from './interfaces/ISvgPublishContext';
import { ViewService } from './services/ViewService';
import { SelectionService } from './services/SelectionService';
import { LinksService } from './services/LinksService';
import { HoverService } from './services/HoverService';
import { HashService } from './services/HashService';
import { IDiagramInfo } from './interfaces/IDiagramInfo';

export class SvgPublishContext {

  public static create(container: HTMLElement, content: string, init?: Partial<IDiagramInfo>): ISvgPublishContext {

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/xml');

    const diagramNode = doc.documentElement.getElementsByTagNameNS("http://vispublish", "SvgPublishData")[0];
    const diagram = {...diagramNode && JSON.parse(diagramNode.innerHTML), ...init };

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
      services: {},
    };

    context.services.view = new ViewService(context, viewBox);

    if (context.diagram.enableSelection) {
      context.services.selection = new SelectionService(context);
    }

    if (context.diagram.enableLinks) {
      context.services.links = new LinksService(context);
    }

    if (context.diagram.enableHover) {
      context.services.hover = new HoverService(context);
    }

    if (context.diagram.enableHash) {
      context.services.hash = new HashService(context);
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

  public static enableService(context: ISvgPublishContext) {

  }

}
