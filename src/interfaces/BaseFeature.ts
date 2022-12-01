
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ISvgPublishContext } from './ISvgPublishContext';

export class BaseFeature {

  protected context: ISvgPublishContext;
  private unsubscribeList = [];

  constructor(context: ISvgPublishContext) {
    this.context = context;
  }

  public subscribe(target: Element, name: string, handler: (evt: Event) => void, options?: boolean | AddEventListenerOptions) {
    target.addEventListener(name, handler, options);
    this.unsubscribeList.push(() => target.removeEventListener(name, handler));
  }

  public destroy() {
    this.unsubscribeList.forEach(unsubscribe => unsubscribe());
    this.unsubscribeList = [];
  }
}
