
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { IDiagramInfo } from './IDiagramInfo';
import { IServices } from './IServices';

export interface ISvgPublishContext {
  container: HTMLElement;
  svg: SVGSVGElement;
  events: EventTarget;
  diagram: IDiagramInfo;
  services: IServices;
}
