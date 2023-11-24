import { ISelectionViewOptions } from "../interfaces/ISelectionViewOptions";
import { Utils } from './Utils';

export const Defaults = {

  selectionColor: 'rgba(255, 255, 0, 0.8)',
  hoverColor: 'rgba(255, 255, 0, 0.2)',
  hyperlinkColor: 'rgba(0, 0, 255, 0.2)',

  getSvgFilterDefaults: (selectionView: ISelectionViewOptions) => ({
    blur: Utils.getValueOrDefault(selectionView?.blur, 2),
    dilate: Utils.getValueOrDefault(selectionView?.dilate, 2),
    enableBlur: Utils.getValueOrDefault(selectionView?.enableBlur, true),
    enableDilate: Utils.getValueOrDefault(selectionView?.enableDilate, true),
    mode: Utils.getValueOrDefault(selectionView?.mode, "normal")
  })
}
