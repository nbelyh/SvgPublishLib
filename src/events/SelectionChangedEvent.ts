export interface ISelectionChangedEventArgs {
  shapeId: string;
}

export class SelectionChangedEvent extends Event {
  args: ISelectionChangedEventArgs;
  constructor(args: ISelectionChangedEventArgs) {
    super('selectionChanged', { cancelable: true });
    this.args = args;
  }
}
