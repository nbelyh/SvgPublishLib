import { IViewService } from './IViewService';
import { ISelectionService } from './ISelectionService';
import { IHoverService } from './IHoverService';
import { ILinksService } from './ILinksService';
import { ITooltipService } from './ITooltipService';
// import { IBasicService } from './IBasicService';

export interface IServices {
  view?: IViewService;
  selection?: ISelectionService;
  links?: ILinksService;
  hover?: IHoverService;
  tooltip?: ITooltipService;
  // [key: string]: IBasicService;
};
