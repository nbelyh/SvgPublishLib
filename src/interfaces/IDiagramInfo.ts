
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ISelectionViewOptions } from './ISelectionViewOptions';
import { ILayerViewOptions } from './ILayerViewOptions';
import { IShapeInfo } from './IShapeInfo';
import { IPageInfo } from './IPageInfo';
import { ILayerInfo } from './ILayerInfo';

export interface IDiagramInfo {

  shapes: { [shapeId: string] : IShapeInfo };

  pages: IPageInfo[];
  currentPage: IPageInfo;

  // enableLayers?: boolean;
  // layers: ILayerInfo[];

  // searchIndex: any;

  fileName: string;
  // urlPrefix: string;

  twoFingersTouch?: boolean;
  // enableAutoFrameHeight?: boolean;
  // safariFullscreen?: boolean;
  // enablePages?: boolean;
  // enablePageLookup?: boolean;
  // enablePageSort?: boolean;

  enableZoomShift?: boolean;
  enableZoomCtrl?: boolean;

  enableProps?: boolean;
  enableLinks?: boolean;

  enableSelection?: boolean;

  // enableSidebar: boolean;

  // enableD3: boolean;
  // skipMinification: boolean;
  // enableMustache: boolean;
  // enableMarked: boolean;

  enableFollowHyperlinks?: boolean;
  openHyperlinksInNewWindow?: boolean;
  // transformVisioFileLinks: boolean;

  // useReadablePageNames: boolean;
  // keepRelativeLinks: boolean;

  // customTemplatePath: boolean;

  // allPages: boolean;
  // singlePage: boolean;
  // selectedPages: boolean;
  // selectedPagesText: string;

  // enableSearch: boolean;
  // enableMultiPageSearch: boolean;

  // rightSidebar: boolean;
  // alwaysHideSidebar: boolean;
  // showSidebarOnSelection: boolean;

  // enableSidbarTitle: boolean;
  // enableSidebarMarkdown: boolean;
  // sidebarMarkdown: string;

  // enablePopovers: boolean;
  // enablePopoverMarkdown: boolean;
  // popoverMarkdown: string;

  // enableContentMarkdown: boolean;
  // contentMarkdown: string;

  // startPageId: number;

  enableTooltips?: boolean;
  enableTooltipMarkdown: boolean;
  tooltipMarkdown: string;

  tooltipTrigger?: 'mouseenter' | 'click' | 'mouseenter click';
  tooltipDelay: boolean;
  tooltipDelayShow: number;
  tooltipDelayHide: number;
  tooltipPlacement: 'auto' | 'auto-start' | 'auto-end' |
    'top' | 'top-start' | 'top-end' |
    'right' | 'right-start' | 'right-end' |
    'bottom' | 'bottom-start' | 'bottom-end' |
    'left' | 'left-start' | 'left-end';
  tooltipUseMousePosition?: boolean;
  tooltipInteractive: boolean;

  // sidebarDefaultWidth: number;

  // popoverTriggerOption: string;
  // popoverTimeout: number;
  // popoverLocationOption: string;
  // popoverUseMousePosition: boolean;
  // popoverOutsideClick: boolean;

  // popoverKeepOnHover: boolean;

  // enableContainerTip: boolean;

  // enablePropertySearch?: boolean;
  // enablePropertySearchFilter?: boolean;

  enableHover?: boolean;

  enablePan?: boolean;
  enableZoom?: boolean;

  selectionView: ISelectionViewOptions;
  layerView: ILayerViewOptions;
}
