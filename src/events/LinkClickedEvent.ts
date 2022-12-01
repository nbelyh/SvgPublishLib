
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { IDiagram } from '../interfaces/IDiagram';
import { ILinkInfo } from '../interfaces/ILinkInfo';
import { IShapeInfo } from '../interfaces/IShapeInfo';

interface ILinkClickedEventArgs {
  evt: PointerEvent;
  diagram: IDiagram
  shape: IShapeInfo;
  link: ILinkInfo;
  href: string;
  target: string;
}

export class LinkClickedEvent extends Event {

  elt: SVGElement;
  args: ILinkClickedEventArgs;

  constructor(elt: SVGElement, args: ILinkClickedEventArgs) {
    super('linkClicked', { cancelable: true });
    this.elt = elt;
    this.args = args;
  }
}
