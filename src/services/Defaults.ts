import { ISelectionViewOptions } from "../interfaces/ISelectionViewOptions";
import { Utils } from './Utils';

export class Defaults {
  public static selectionColor = 'rgba(255, 255, 0, 0.8)';
  public static hoverColor = 'rgba(255, 255, 0, 0.2)';
  public static hyperlinkColor = 'rgba(0, 0, 255, 0.2)';

  public static prevShapeColor = 'rgba(0xA0, 0xFF, 0xFF, 0.9)';
  public static nextShapeColor = 'rgba(0xFF, 0xA0, 0xFF, 0.9)';
  public static prevConnColor = 'rgba(0xFF, 0x00, 0x00, 1.0)';
  public static nextConnColor = 'rgba(0xFF, 0x00, 0x00, 1.0)';

  public static getSvgFilterDefaults(selectionView: ISelectionViewOptions) {
    return {
      blur: Utils.getValueOrDefault(selectionView?.blur, 2),
      dilate: Utils.getValueOrDefault(selectionView?.dilate, 2),
      enableBlur: Utils.getValueOrDefault(selectionView?.enableBlur, true),
      enableDilate: Utils.getValueOrDefault(selectionView?.enableDilate, true),
      mode: Utils.getValueOrDefault(selectionView?.mode, "normal")
    }
  }


  public static getHoverFilterId = (guid: string) => `vp-filter-hover-${guid}`;
  public static getHyperlinkFilterId = (guid: string) => `vp-filter-hyperlink-${guid}`;
  public static getSelectionFilterId = (guid: string) => `vp-filter-select-${guid}`;
  public static getPrevShapeFilterId = (guid: string) => `vp-filter-prev-shape-${guid}`;
  public static getNextShapeFilterId = (guid: string) => `vp-filter-next-shape-${guid}`;

  public static getConnPathId = (guid: string, shape: string) => `vp-conn-path-${guid}-${shape}`;
  public static getMarkerEndId = (guid: string, shape: string) => `vp-marker-end-${guid}-${shape}`;
  public static getMarkerStartId = (guid: string, shape: string) => `vp-marker-start-${guid}-${shape}`;

  public static getSelectionBoxId = (guid: string) => `vp-selection-box-${guid}`;
  public static getHoverBoxId = (guid: string) => `vp-hover-box-${guid}`;

  public static getFilterDefsId = (guid: string) => `vp-defs-${guid}`;
}
