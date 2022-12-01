
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { BaseFeature } from './BaseFeature';
import { IDiagramInfo } from './IDiagramInfo';

export interface ISvgPublishContext {
  container: HTMLElement;
  svg: SVGSVGElement;
  events: EventTarget;
  diagram: IDiagramInfo;
  services: { [key: string]: BaseFeature };
}
