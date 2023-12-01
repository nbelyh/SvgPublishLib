
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';

export interface IViewChangedEventData {
  context: ISvgPublishContext;
  triggerEvent: Event;
}

export type ViewChangedEvent = CustomEvent<IViewChangedEventData>;
