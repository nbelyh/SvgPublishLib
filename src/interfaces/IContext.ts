
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { BaseFeature } from 'services/BaseFeature';
import { IDiagram } from './IDiagram';

export interface IContext {
  container: HTMLElement;
  svg: SVGSVGElement;
  events: EventTarget;
  diagram: IDiagram;
  selectedShapeId: string;
  services: { [key: string]: BaseFeature };
}
