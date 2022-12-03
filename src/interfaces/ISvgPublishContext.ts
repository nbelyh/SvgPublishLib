
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { IHashService } from "./IHashService";
import { IViewService } from './IViewService';
import { IBasicService } from './IBasicService';
import { IDiagramInfo } from './IDiagramInfo';
import { ISelectionService } from './ISelectionService';
import { LinksService } from '../services/LinksService';
import { IHoverService } from './IHoverService';

export interface ISvgPublishContext {
  container: HTMLElement;
  svg: SVGSVGElement;
  events: EventTarget;
  diagram: IDiagramInfo;
  services: {
    view?: IViewService;
    selection?: ISelectionService;
    links?: LinksService;
    hover?: IHoverService;
    hash?: IHashService;
    [key: string]: IBasicService
  };
}
