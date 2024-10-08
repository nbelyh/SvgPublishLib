
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';
import { ILinkInfo } from '../interfaces/ILinkInfo';
import { IShapeInfo } from '../interfaces/IShapeInfo';

export interface ILinkClickedEventData {
  context: ISvgPublishContext;
  triggerEvent: PointerEvent;
  shape: IShapeInfo;
  link: ILinkInfo;
  href: string;
  target: string;
}

export type LinkClickedEvent = CustomEvent<ILinkClickedEventData>;
