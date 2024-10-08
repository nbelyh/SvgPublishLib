import { ISelectionViewOptions } from '../interfaces/ISelectionViewOptions';
import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';
import { Defaults } from './Defaults';
import { SvgFilters } from './SvgFilters';
import { Utils } from './Utils';

export class SelectionUtils {

  private static getMarkerId(markerUrl: string) {
    const match = markerUrl.match(/url\("(.*)"\)/);
    return match && match[1];
  }

  private static removeElementById(markerId: string, context: ISvgPublishContext) {
    const elem = context.svg.getElementById(markerId);
    if (elem) {
      elem.parentElement.removeChild(elem);
    }
  }

  private static replaceMarker(oldId: string, newId: string, selectColor: string, context: ISvgPublishContext) {
    const markerNode = context.svg.querySelector(oldId) as SVGMarkerElement;
    if (markerNode) {
      const markerNodeClone = markerNode.cloneNode(true) as SVGMarkerElement;
      markerNodeClone.id = newId;
      markerNodeClone.style.stroke = selectColor;
      markerNodeClone.style.fill = selectColor;
      markerNode.parentElement.appendChild(markerNodeClone);
    }
  }

  public static createHoverFilters(context: ISvgPublishContext, selectionView: ISelectionViewOptions) {

    const svgFilterDefaults = Defaults.getSvgFilterDefaults(selectionView);

    SvgFilters.createFilterNode(context.svg, context.guid, Defaults.getHoverFilterId(context.guid), {
      ...svgFilterDefaults,
      color: Utils.getValueOrDefault(selectionView?.hoverColor, Defaults.hoverColor)
    });

    SvgFilters.createFilterNode(context.svg, context.guid, Defaults.getHyperlinkFilterId(context.guid), {
      ...svgFilterDefaults,
      color: Utils.getValueOrDefault(selectionView?.hyperlinkColor, Defaults.hyperlinkColor)
    });
  }

  public static destroyHoverFilters(context: ISvgPublishContext) {
    SelectionUtils.removeElementById(Defaults.getHoverFilterId(context.guid), context);
    SelectionUtils.removeElementById(Defaults.getHyperlinkFilterId(context.guid), context);
  }

  public static createSelectionFilters(context: ISvgPublishContext, selectionView: ISelectionViewOptions) {

    const svgFilterDefaults = Defaults.getSvgFilterDefaults(selectionView);

    SvgFilters.createFilterNode(context.svg, context.guid, Defaults.getSelectionFilterId(context.guid), {
      ...svgFilterDefaults,
      color: Utils.getValueOrDefault(selectionView?.selectColor, Defaults.selectionColor)
    });

    if (selectionView.enableNextShapeColor) {
      SvgFilters.createFilterNode(context.svg, context.guid, Defaults.getNextShapeFilterId(context.guid), {
        ...svgFilterDefaults,
        color: Utils.getValueOrDefault(selectionView?.nextShapeColor, Defaults.nextShapeColor)
      });
    }

    if (selectionView.enablePrevShapeColor) {
      SvgFilters.createFilterNode(context.svg, context.guid, Defaults.getPrevShapeFilterId(context.guid), {
        ...svgFilterDefaults,
        color: Utils.getValueOrDefault(selectionView?.prevShapeColor, Defaults.prevShapeColor)
      });
    }
  }

  public static destroySelectionFilters(context: ISvgPublishContext) {
    SelectionUtils.removeElementById(Defaults.getSelectionFilterId(context.guid), context);
    SelectionUtils.removeElementById(Defaults.getNextShapeFilterId(context.guid), context);
    SelectionUtils.removeElementById(Defaults.getPrevShapeFilterId(context.guid), context);
  }


  public static removeConnHighlight(shape: SVGElement, context: ISvgPublishContext) {
    SelectionUtils.removeElementById(Defaults.getConnPathId(context.guid, shape.id), context);
    SelectionUtils.removeElementById(Defaults.getMarkerEndId(context.guid, shape.id), context);
    SelectionUtils.removeElementById(Defaults.getMarkerStartId(context.guid, shape.id), context);
  }

  public static setConnHighlight(shape: SVGElement, selectColor: string, context: ISvgPublishContext) {

    SelectionUtils.removeConnHighlight(shape, context);

    var path = shape.querySelector('path') as SVGPathElement;
    if (path) {

      const style = getComputedStyle(path);

      var pathClone = path.cloneNode(true) as SVGPathElement;
      pathClone.id = Defaults.getConnPathId(context.guid, shape.id);
      pathClone.style.stroke = selectColor;

      const selectionView = context.diagram.selectionView;

      if (selectionView.enableConnDilate) {
        const strokeWidth = parseFloat(style.strokeWidth) + (+selectionView.connDilate || 2);
        pathClone.style.strokeWidth = strokeWidth + "px";
      }

      pathClone.style.pointerEvents = 'none';

      const markerEndId = SelectionUtils.getMarkerId(style.markerEnd);
      if (markerEndId) {
        const id = Defaults.getMarkerEndId(context.guid, shape.id);
        SelectionUtils.replaceMarker(markerEndId, id, selectColor, context);
        pathClone.style.markerEnd = `url("#${id}")`;
      }
      const markerStartId = SelectionUtils.getMarkerId(style.markerStart);
      if (markerStartId) {
        const id = Defaults.getMarkerStartId(context.guid, shape.id);
        SelectionUtils.replaceMarker(markerStartId, id, selectColor, context);
        pathClone.style.markerStart = `url("#${id}")`;
      }

      shape.appendChild(pathClone);
    }
  }

  public static removeShapeHighlight(shape: SVGElement, context: ISvgPublishContext) {
    if (context.diagram.selectionView.enableBoxSelection) {
      SelectionUtils.removeElementById(Defaults.getSelectionBoxId(context.guid), context);
    } else {
      shape.removeAttribute('filter');
    }
  }

  public static setShapeHighlight(shape: SVGGElement, filter: string, selectColor: string, context: ISvgPublishContext) {

    SelectionUtils.removeShapeHighlight(shape, context);

    const selectionView = context.diagram.selectionView;

    if (selectionView?.enableBoxSelection) {

      const rect = shape.getBBox();
      const options = {
        color: selectColor,
        dilate: selectionView.dilate || 4,
        enableDilate: selectionView.enableDilate,
        mode: selectionView.mode
      };

      const box = SvgFilters.createSelectionBox(Defaults.getSelectionBoxId(context.guid), rect, options);
      shape.appendChild(box);
    } else {
      shape.setAttribute('filter', `url(#${filter})`);
    }
  }


}
