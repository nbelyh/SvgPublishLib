import { ISvgPublishContext } from './interfaces/ISvgPublishContext';
import { ViewService } from './services/ViewService';
import { SelectionService } from './services/SelectionService';
import { LinksService } from './services/LinksService';
import { HoverService } from './services/HoverService';
import { HashService } from './services/HashService';
import { IDiagramInfo } from './interfaces/IDiagramInfo';
import { IServices } from './interfaces/IServices';

export class SvgPublishContext implements ISvgPublishContext {

  container: HTMLElement;
  svg: SVGSVGElement;
  events: EventTarget;
  diagram: IDiagramInfo;
  services: IServices;

  public constructor(container: HTMLElement, content: string, init?: Partial<IDiagramInfo>) {

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/xml');

    const diagramNode = doc.documentElement.getElementsByTagNameNS("http://vispublish", "SvgPublishData")[0];
    const diagram = { ...diagramNode && JSON.parse(diagramNode.innerHTML), ...init };

    const viewBox = diagram.viewBox || doc.documentElement.getAttribute('viewBox');
    doc.documentElement.removeAttribute('viewBox');
    doc.documentElement.setAttribute('width', '100%');
    doc.documentElement.setAttribute('height', '100%');

    container.innerHTML = doc.documentElement.outerHTML;

    this.container = container;
    this.svg = container.querySelector('svg');
    this.events = new EventTarget;
    this.diagram = diagram;

    this.services = {};

    this.services.view = new ViewService(this, viewBox);

    if (this.diagram.enableSelection) {
      this.enableService('selection', true);
    }

    if (this.diagram.enableLinks) {
      this.enableService('links', true);
    }

    if (this.diagram.enableHover) {
      this.enableService('hover', true);
    }

    if (this.diagram.enableHash) {
      this.enableService('hash', true);
    }
  }

  public destroy() {
    const serviceKeys = Object.keys(this.services) as (keyof IServices)[];
    for (const serviceKey of serviceKeys) {
      this.destroyService(serviceKey);
    }
    this.container.innerHTML = '';
  }

  private createService(name: keyof IServices) {
    switch (name) {
      case 'selection': return new SelectionService(this);
      case 'links': return new LinksService(this);
      case 'hover': return new HoverService(this);
      case 'hash': return new HashService(this);
    }
  }

  private destroyService(name: keyof IServices) {
    this.services[name].destroy();
    delete this.services[name];
  }

  public enableService(name: keyof IServices, enable: boolean) {
    if (enable) {
      this.services[name] = this.createService(name) as any;
    } else {
      this.destroyService(name);
    }
  }
}
