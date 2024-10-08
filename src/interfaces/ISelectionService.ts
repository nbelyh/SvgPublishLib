import { IBasicService } from './IBasicService';


export interface ISelectionService extends IBasicService {
  readonly selectedShapeId: string;
  readonly highlightedShapeIds: { [shapeId: string]: boolean};
  setSelection(shapeId: string): void;
  clearSelection(): void;
}
