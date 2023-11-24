
import { IBasicService } from './IBasicService';

export interface IViewService extends IBasicService {
  reset(): void;

  setFocusShape(shapeId: string): void;
  zoom(z: number): void;
}
