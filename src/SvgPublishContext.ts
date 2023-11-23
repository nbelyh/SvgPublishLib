import { ISvgPublishContext } from './interfaces/ISvgPublishContext';
import { ViewService } from './services/ViewService';
import { SelectionService } from './services/SelectionService';
import { LinksService } from './services/LinksService';
import { HoverService } from './services/HoverService';
import { HashService } from './services/HashService';
import { IDiagramInfo } from './interfaces/IDiagramInfo';
import { IServices } from './interfaces/IServices';
import { VisioSvgParser } from './services/VisioSvgParser';

export class SvgPublishContext implements ISvgPublishContext {

  container: HTMLElement;
  svg: SVGSVGElement;
  events: EventTarget;
  diagram: IDiagramInfo;
  services: IServices;

  public constructor(container: HTMLElement, content: string, init?: Partial<IDiagramInfo>) {

    const { svgXml, viewBox, diagramInfo } = VisioSvgParser.parse(content);

    container.innerHTML = svgXml;

    this.container = container;
    this.svg = container.querySelector('svg');
    this.events = new EventTarget;
    this.diagram = { ...diagramInfo, ...init };

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
    if (this.services[name]) {
      this.services[name].destroy();
      delete this.services[name];
    }
  }

  public enableService(name: keyof IServices, enable: boolean) {
    if (enable) {
      this.services[name] = this.createService(name) as any;
    } else {
      this.destroyService(name);
    }
  }
}
