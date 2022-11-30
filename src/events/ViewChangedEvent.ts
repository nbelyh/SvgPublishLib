export interface IViewChangedEventArgs {
}

export class ViewChangedEvent extends Event {
  args: IViewChangedEventArgs;
  constructor(args: IViewChangedEventArgs) {
    super('viewChanged');
    this.args = args;
  }
}
