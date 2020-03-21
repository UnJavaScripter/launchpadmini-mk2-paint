import { stateController } from './state-controller.js';
class LaunchpadController {
    constructor() {
    }
    paint(key, color) {
        this.midiOut = this.midiOut || stateController.midiOutput;
        this.midiOut.send([144, key, color]);
    }
    erase(key) {
        this.midiOut = this.midiOut || stateController.midiOutput;
        this.midiOut.send([128, key, 0]);
    }
}
export const launchpadController = new LaunchpadController();
