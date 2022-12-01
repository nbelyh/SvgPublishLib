import { BaseFeature } from '../interfaces/BaseFeature';
import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';
import { View } from './View';

export class Hash extends BaseFeature {

  constructor(context: ISvgPublishContext) {
    super(context);
    this.subscribe(window, 'hashchange', this.processHash);
  }

  public static getUrlParameter(name: string) {
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.hash);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  private processHash() {
    const startShape = Hash.getUrlParameter('shape');
    if (startShape) {
      const view = this.context.services.view as View;
      view.setFocusShape(startShape);
    }

    const startZoom = Hash.getUrlParameter('zoom');
    if (startZoom) {
      const view = this.context.services.view as View;
      view.zoom(startZoom);
    }
  }

}
