import { ISelectionViewOptions } from "../interfaces/ISelectionViewOptions";
import { Utils } from './Utils';

export class Defaults {
  public static selectionColor = 'rgba(255, 255, 0, 0.8)';
  public static hoverColor = 'rgba(255, 255, 0, 0.2)';
  public static hyperlinkColor = 'rgba(0, 0, 255, 0.2)';

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

  public static getSelectionBoxId = (guid: string) => `vp-selection-box-${guid}`;
  public static getHoverBoxId = (guid: string) => `vp-hover-box-${guid}`;

  public static getFilterDefsId = (guid: string) => `vp-defs-${guid}`;
}
