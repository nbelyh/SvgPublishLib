
import { ILayerViewOptions } from './ILayerViewOptions';
import { ISelectionViewOptions } from './ISelectionViewOptions';

export interface IDiagram {

  svg: SVGSVGElement;
  viewBox: string;

  shapes: any[];
  selectedShapeId: string;
  events: EventTarget;

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