
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { IBasicService } from '../interfaces/IBasicService';
import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';

export class BasicService implements IBasicService {

  protected context: ISvgPublishContext;
  private unsubscribeList = [];

  constructor(context: ISvgPublishContext) {
    this.context = context;
  }

  public reset() {
  }

  protected subscribe(target: Element | Window, name: string, handler: (evt: Event) => void, options?: boolean | AddEventListenerOptions) {
    target.addEventListener(name, handler, options);
    this.unsubscribeList.push(() => target.removeEventListener(name, handler));
  }

  protected unsubscribe() {
    this.unsubscribeList.forEach(unsubscribe => unsubscribe());
    this.unsubscribeList = [];
  }

  public destroy() {
    this.unsubscribe();
  }
}
