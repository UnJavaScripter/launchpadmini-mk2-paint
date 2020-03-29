import { stateController } from './state-controller.js';
import { eventDispatcher } from './event-dispatcher.js';
class InteractionController {
    constructor() {
        this.MockColorPicker = { selectedColor: 'limegreen' };
    }
    handleUserAction(key, skipHistory = false) {
        if (stateController.activePixels.has(key)) {
            this.erase(key, skipHistory);
        }
        else {
            this.paint(key, skipHistory);
        }
    }
    erase(key, skipHistory = false) {
        eventDispatcher.erase(key);
    }
    paint(key, skipHistory = false) {
        eventDispatcher.paint(key);
    }
}
export const interactionController = new InteractionController();
