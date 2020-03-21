import { stateController } from './state-controller.js';
import { eventDispatcher } from './event-dispatcher.js';
class InteractionController {
    handleUserAction(midiOut, key, color = 60, skipHistory = false) {
        color = eventDispatcher.selectedPaintColor || color;
        if (stateController.activePixels.has(key) && stateController.activePixels.get(key).color === color) {
            stateController.activePixels.delete(key);
            this.erase(midiOut, key, skipHistory);
        }
        else {
            stateController.activePixels.set(key, { color });
            this.paint(midiOut, key, color, skipHistory);
        }
    }
    erase(midiOut, key, skipHistory = false) {
        eventDispatcher.erase(midiOut, key);
    }
    paint(midiOut, key, color, skipHistory = false) {
        eventDispatcher.paint(midiOut, key, color);
    }
}
export const interactionController = new InteractionController();
