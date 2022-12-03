import { IHashService } from "./IHashService";
import { IViewService } from './IViewService';
import { ISelectionService } from './ISelectionService';
import { IHoverService } from './IHoverService';
import { ILinksService } from './ILinksService';
// import { IBasicService } from './IBasicService';

export interface IServices {
  view?: IViewService;
  selection?: ISelectionService;
  links?: ILinksService;
  hover?: IHoverService;
  hash?: IHashService;
  // [key: string]: IBasicService;
};
