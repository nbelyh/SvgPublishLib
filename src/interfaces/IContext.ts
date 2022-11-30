import { IDiagram } from './IDiagram';

export interface IContext {
  container: HTMLElement;
  svg: SVGSVGElement;
  events: EventTarget;
  diagram: IDiagram;
  selectedShapeId: string;
  baseUrl: string;
}
