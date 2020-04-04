class StateController {
    constructor() {
        this._activePixels = new Map();
    }
    get activePixels() {
        return this._activePixels;
    }
    clearActivePixels() {
        this._activePixels = new Map();
        this.lastActivePixel = undefined;
    }
}
export const stateController = new StateController();
