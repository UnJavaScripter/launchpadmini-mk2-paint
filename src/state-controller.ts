import { KeyProps } from './models.js'

class StateController {
  private _activePixels : Map<number, KeyProps> = new Map();
  selectedPaintColor: number;
  lastActivePixel: KeyProps;

  get activePixels() {
    return this._activePixels;
  }

}

export const stateController = new StateController()