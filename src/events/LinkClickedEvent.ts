
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { IContext } from '../interfaces/IContext';
import { ILinkInfo } from '../interfaces/ILinkInfo';
import { IShapeInfo } from '../interfaces/IShapeInfo';

interface ILinkClickedEventArgs {
  context: IContext;
  triggerEvent: PointerEvent;
  shape: IShapeInfo;
  link: ILinkInfo;
  href: string;
  target: string;
}

export class LinkClickedEvent extends Event {

  args: ILinkClickedEventArgs;

  constructor(args: ILinkClickedEventArgs) {
    super('linkClicked', { cancelable: true });
    this.args = args;
  }
}
