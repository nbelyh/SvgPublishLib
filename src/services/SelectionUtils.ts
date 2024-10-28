import { ISelectionViewOptions } from '../interfaces/ISelectionViewOptions';
import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';
import { DefaultColors } from '../constants/DefaultColors';
import { SvgFilters } from './SvgFilters';
import { Utils } from './Utils';

export class SelectionUtils {

  public static getHoverFilterId = (guid: string) => `vp-filter-hover-${guid}`;
  public static getHyperlinkFilterId = (guid: string) => `vp-filter-hyperlink-${guid}`;
  public static getSelectionFilterId = (guid: string) => `vp-filter-select-${guid}`;
  public static getPrevShapeFilterId = (guid: string) => `vp-filter-prev-shape-${guid}`;
  public static getNextShapeFilterId = (guid: string) => `vp-filter-next-shape-${guid}`;

  private static getConnPathId = (guid: string, shape: string) => `vp-conn-path-${guid}-${shape}`;
  private static getMarkerEndId = (guid: string, shape: string) => `vp-marker-end-${guid}-${shape}`;
  private static getMarkerStartId = (guid: string, shape: string) => `vp-marker-start-${guid}-${shape}`;

  public static getSelectionBoxId = (guid: string, shape: string) => `vp-selection-box-${guid}-${shape}`;

  private static getMarkerId(markerUrl: string) {
    const match = markerUrl.match(/url\("(.*)"\)/);
    return match && match[1];
  }

  public static removeElementById(markerId: string, context: ISvgPublishContext) {
    const elem = context.svg.getElementById(markerId);
    if (elem) {
      elem.parentElement.removeChild(elem);
    }
  }

  private static replaceMarker(oldId: string, newId: string, selectionColor: string, context: ISvgPublishContext) {
    const markerNode = context.svg.querySelector(oldId) as SVGMarkerElement;
    if (markerNode) {
      const markerNodeClone = markerNode.cloneNode(true) as SVGMarkerElement;
      markerNodeClone.id = newId;
      markerNodeClone.style.stroke = selectionColor;
      markerNodeClone.style.fill = selectionColor;
      markerNode.parentElement.appendChild(markerNodeClone);
    }
  }

  private static getSvgFilterDefaults(selectionView: ISelectionViewOptions) {
    return {
      blur: Utils.getValueOrDefault(selectionView?.blur, 2),
      dilate: Utils.getValueOrDefault(selectionView?.dilate, 2),
      enableBlur: Utils.getValueOrDefault(selectionView?.enableBlur, true),
      enableDilate: Utils.getValueOrDefault(selectionView?.enableDilate, true),
      mode: Utils.getValueOrDefault(selectionView?.selectionMode, "normal")
    }
  }

  public static createHoverFilters(context: ISvgPublishContext, selectionView: ISelectionViewOptions) {

    const svgFilterDefaults = SelectionUtils.getSvgFilterDefaults(selectionView);

    SvgFilters.createFilterNode(context.svg, context.guid, SelectionUtils.getHoverFilterId(context.guid), {
      ...svgFilterDefaults,
      color: Utils.getValueOrDefault(selectionView?.hoverColor, DefaultColors.hoverColor)
    });

    SvgFilters.createFilterNode(context.svg, context.guid, SelectionUtils.getHyperlinkFilterId(context.guid), {
      ...svgFilterDefaults,
      color: Utils.getValueOrDefault(selectionView?.hyperlinkColor, DefaultColors.hyperlinkColor)
    });
  }

  public static destroyHoverFilters(context: ISvgPublishContext) {
    SelectionUtils.removeElementById(SelectionUtils.getHoverFilterId(context.guid), context);
    SelectionUtils.removeElementById(SelectionUtils.getHyperlinkFilterId(context.guid), context);
  }

  public static createSelectionFilters(context: ISvgPublishContext, selectionView: ISelectionViewOptions) {

    const svgFilterDefaults = SelectionUtils.getSvgFilterDefaults(selectionView);

    SvgFilters.createFilterNode(context.svg, context.guid, SelectionUtils.getSelectionFilterId(context.guid), {
      ...svgFilterDefaults,
      color: Utils.getValueOrDefault(selectionView?.selectionColor, DefaultColors.selectionColor)
    });

    if (selectionView.enableNextShapeColor) {
      SvgFilters.createFilterNode(context.svg, context.guid, SelectionUtils.getNextShapeFilterId(context.guid), {
        ...svgFilterDefaults,
        color: Utils.getValueOrDefault(selectionView?.nextShapeColor, DefaultColors.nextShapeColor)
      });
    }

    if (selectionView.enablePrevShapeColor) {
      SvgFilters.createFilterNode(context.svg, context.guid, SelectionUtils.getPrevShapeFilterId(context.guid), {
        ...svgFilterDefaults,
        color: Utils.getValueOrDefault(selectionView?.prevShapeColor, DefaultColors.prevShapeColor)
      });
    }
  }

  public static destroySelectionFilters(context: ISvgPublishContext) {
    SelectionUtils.removeElementById(SelectionUtils.getSelectionFilterId(context.guid), context);
    SelectionUtils.removeElementById(SelectionUtils.getNextShapeFilterId(context.guid), context);
    SelectionUtils.removeElementById(SelectionUtils.getPrevShapeFilterId(context.guid), context);
  }


  public static removeConnHighlight(shape: SVGElement, context: ISvgPublishContext) {
    SelectionUtils.removeElementById(SelectionUtils.getConnPathId(context.guid, shape.id), context);
    SelectionUtils.removeElementById(SelectionUtils.getMarkerEndId(context.guid, shape.id), context);
    SelectionUtils.removeElementById(SelectionUtils.getMarkerStartId(context.guid, shape.id), context);
  }

  public static setConnHighlight(shape: SVGElement, selectionColor: string, context: ISvgPublishContext) {

    SelectionUtils.removeConnHighlight(shape, context);

    var path = shape.querySelector('path') as SVGPathElement;
    if (path) {

      const style = getComputedStyle(path);

      const id = SelectionUtils.getConnPathId(context.guid, shape.id);

      var pathClone = path.cloneNode(true) as SVGPathElement;
      pathClone.id = id;
      pathClone.style.stroke = selectionColor;

      const selectionView = context.diagram.selectionView;

      if (selectionView.enableConnDilate) {
        const strokeWidth = parseFloat(style.strokeWidth) + Utils.getValueOrDefault(selectionView.connDilate, 1);
        pathClone.style.strokeWidth = strokeWidth + "px";
      }

      pathClone.style.pointerEvents = 'none';

      const markerEndId = SelectionUtils.getMarkerId(style.markerEnd);
      if (markerEndId) {
        const id = SelectionUtils.getMarkerEndId(context.guid, shape.id);
        SelectionUtils.replaceMarker(markerEndId, id, selectionColor, context);
        pathClone.style.markerEnd = `url("#${id}")`;
      }
      const markerStartId = SelectionUtils.getMarkerId(style.markerStart);
      if (markerStartId) {
        const id = SelectionUtils.getMarkerStartId(context.guid, shape.id);
        SelectionUtils.replaceMarker(markerStartId, id, selectionColor, context);
        pathClone.style.markerStart = `url("#${id}")`;
      }

      shape.appendChild(pathClone);
      return id;
    }
  }

  public static removeShapeHighlight(shape: SVGElement, boxId: string, context: ISvgPublishContext) {
    if (context.diagram.selectionView.enableBoxSelection) {
      SelectionUtils.removeElementById(boxId, context);
    } else {
      shape.removeAttribute('filter');
    }
  }

  public static setShapeHighlight(shape: SVGGElement, boxId: string, filter: string, selectionColor: string, context: ISvgPublishContext) {

    SelectionUtils.removeShapeHighlight(shape, boxId, context);

    const selectionView = context.diagram.selectionView;

    if (selectionView?.enableBoxSelection) {

      const rect = shape.getBBox();
      const options = {
        color: selectionColor,
        dilate: selectionView.dilate || 4,
        enableDilate: selectionView.enableDilate,
        mode: selectionView.selectionMode
      };

      const box = SvgFilters.createSelectionBox(boxId, rect, options);
      shape.appendChild(box);
    } else {
      shape.setAttribute('filter', `url(#${filter})`);
    }
  }


}
