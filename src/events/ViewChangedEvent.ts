
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

export interface IViewChangedEventArgs {
}

export class ViewChangedEvent extends Event {
  args: IViewChangedEventArgs;
  constructor(args: IViewChangedEventArgs) {
    super('viewChanged');
    this.args = args;
  }
}
