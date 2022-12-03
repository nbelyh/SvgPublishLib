import { BasicService } from './BasicService';
import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';
import { IHashService } from '../interfaces/IHashService';

export class HashService extends BasicService implements IHashService {

  constructor(context: ISvgPublishContext) {
    super(context);
    this.subscribe(window, 'hashchange', this.processHash);
    this.processHash();
  }

  public static getUrlParameter(name: string) {
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.hash);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  private processHash() {
    const startShape = HashService.getUrlParameter('shape');
    if (startShape) {
      this.context.services.view.setFocusShape(startShape);
    }

    const startZoom = HashService.getUrlParameter('zoom');
    if (startZoom) {
      this.context.services.view.zoom(+startZoom);
    }
  }

}
