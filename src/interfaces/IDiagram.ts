
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ISelectionViewOptions } from './ISelectionViewOptions';
import { ILayerViewOptions } from './ILayerViewOptions';
import { IShapeInfo } from './IShapeInfo';
import { IPageInfo } from './IPageInfo';
import { ILayerInfo } from './ILayerInfo';

export interface IDiagram {

  shapes: IShapeInfo[];

  pages: IPageInfo[];
  currentPage: IPageInfo;

  layers: ILayerInfo[];

  searchIndex: any;

  fileName: string;
  urlPrefix: string;
  markOfTheWeb: boolean;
  twoFingersTouch: boolean;
  enableAutoFrameHeight: boolean;
  safariFullscreen: boolean;
  enablePages: boolean;
  enablePageLookup: boolean;
  enablePageSort: boolean;
  enableZoomShift: boolean;
  enableZoomCtrl: boolean;

  enableProps: boolean;
  enableLinks: boolean;
  enableFollowHyperlinks: boolean;
  enableSelection: boolean;
  enableLayers: boolean;
  enableTooltips: boolean;

  enableSidebar: boolean;

  enableD3: boolean;
  skipMinification: boolean;
  enableBootstrapSwitch: boolean;
  enableBootstrapSelect: boolean;
  enableMustache: boolean;
  enableMarked: boolean;

  followHyperlinks: boolean;
  openHyperlinksInNewWindow: boolean;
  transformVisioFileLinks: boolean;

  useReadablePageNames: boolean;
  keepRelativeLinks: boolean;

  customTemplatePath: boolean;

  allPages: boolean;
  singlePage: boolean;
  selectedPages: boolean;
  selectedPagesText: string;

  enableSearch: boolean;
  enableMultiPageSearch: boolean;

  rightSidebar: boolean;
  alwaysHideSidebar: boolean;
  showSidebarOnSelection: boolean;

  enableSidbarTitle: boolean;
  enableSidebarMarkdown: boolean;
  sidebarMarkdown: string;

  enableTooltipMarkdown: boolean;
  tooltipMarkdown: boolean;

  enablePopovers: boolean;
  enablePopoverMarkdown: boolean;
  popoverMarkdown: string;

  enableContentMarkdown: boolean;
  contentMarkdown: string;

  tooltipLocationOption: string;
  popoverLocationOption: string;

  startPageId: number;

  tooltipTriggerOption: string;
  tooltipTimeout: number;
  tooltipTimeoutShow: number;
  tooltipTimeoutHide: number;

  sidebarDefaultWidth: number;

  popoverTriggerOption: string;
  popoverTimeout: number;

  popoverOutsideClick: boolean;
  tooltipOutsideClick: boolean;

  tooltipKeepOnHover: boolean;
  popoverKeepOnHover: boolean;

  enableContainerTip: boolean;

  enablePropertySearch: boolean;
  enablePropertySearchFilter: boolean;

  popoverUseMousePosition: boolean;
  tooltipUseMousePosition: boolean;

  enableHover: boolean;

  selectionView: ISelectionViewOptions;
  layerView: ILayerViewOptions;
}
