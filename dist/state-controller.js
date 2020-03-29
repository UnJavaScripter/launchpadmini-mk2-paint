class StateController {
    constructor() {
        this._activePixels = new Map();
    }
    get activePixels() {
        return this._activePixels;
    }
}
export const stateController = new StateController();
