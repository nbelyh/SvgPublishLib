
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { IContext } from '../interfaces/IContext';

export interface ISelectionChangedEventArgs {
  triggerEvent: Event;
  context: IContext;
  shapeId: string;
}

export class SelectionChangedEvent extends Event {
  args: ISelectionChangedEventArgs;
  constructor(args: ISelectionChangedEventArgs) {
    super('selectionChanged', { cancelable: true });
    this.args = args;
  }
}
