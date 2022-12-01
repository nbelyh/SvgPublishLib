
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { IDiagram } from '../interfaces/IDiagram';

export interface ISelectionChangedEventArgs {
  diagram: IDiagram;
  shapeId: string;
}

export class SelectionChangedEvent extends Event {
  args: ISelectionChangedEventArgs;
  constructor(args: ISelectionChangedEventArgs) {
    super('selectionChanged', { cancelable: true });
    this.args = args;
  }
}
