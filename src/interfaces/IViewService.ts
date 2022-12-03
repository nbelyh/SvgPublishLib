
import { IBasicService } from './IBasicService';

export interface IViewService extends IBasicService {
  reset(): void;

  isPanEnabled(): boolean;
  setPanEnabled(val: boolean): void;

  isZoomEnabled(): boolean;
  setZoomEnabled(val: boolean): void;

  setFocusShape(shapeId: string): void;
  zoom(z: number): void;
}
