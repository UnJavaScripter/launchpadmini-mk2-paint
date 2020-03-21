var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class StateController {
    constructor() {
        this._activePixels = new Map();
    }
    get activePixels() {
        return this._activePixels;
    }
    setMidiOutput(midiOutput) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (!midiOutput) {
                    return reject('no midi output provided');
                }
                this._midiOutput = midiOutput;
                resolve(this.midiOutput);
            });
        });
    }
    get midiOutput() {
        return this._midiOutput;
    }
}
export const stateController = new StateController();
