import { IBasicService } from './IBasicService';


export interface ISelectionService extends IBasicService {
  selectedShapeId: string;
}
