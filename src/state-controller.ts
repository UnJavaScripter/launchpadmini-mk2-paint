import { KeyProps } from './models.js'

class StateController {
  private _activePixels : Map<number, KeyProps> = new Map();
  selectedPaintColor: number;
  lastActivePixel: KeyProps;

  get activePixels() {
    return this._activePixels;
  }

  clearActivePixels() {
    this._activePixels = new Map();
    this.lastActivePixel = undefined;
  }

}

export const stateController = new StateController()