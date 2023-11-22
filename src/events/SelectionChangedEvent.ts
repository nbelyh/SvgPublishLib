
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ISvgPublishContext } from '../interfaces/ISvgPublishContext';

export interface ISelectionChangedEventArgs {
  triggerEvent: Event;
  context: ISvgPublishContext;
  shapeId: string;
}

export class SelectionChangedEvent extends Event {
  args?: ISelectionChangedEventArgs;
  constructor(args: ISelectionChangedEventArgs) {
    super('selectionChanged', { cancelable: true });
    this.args = args;
  }
}
