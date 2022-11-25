export class SelectionChangedEvent extends Event {
  selectedShapeId: string;
  constructor(selectedShapeId: string) {
    super('selectionChanged');
    this.selectedShapeId = selectedShapeId;
  }
}
