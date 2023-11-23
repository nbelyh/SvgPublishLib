import { IBasicService } from './IBasicService';


export interface ISelectionService extends IBasicService {
  selectedShapeId: string;
  reset(): void;
  setSelection(shapeId: string): void;
  clearSelection(): void;
}
