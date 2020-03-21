import { stateController } from './state-controller.js';
import { eventDispatcher } from './event-dispatcher.js';
import { canvasController } from './canvas-controller.js';
class InteractionController {
    constructor() {
        this.MockColorPicker = { selectedColor: 'limegreen' };
        canvasController.canvasElem.addEventListener('pointerdown', (event) => {
            this.handlePointerDown(event);
        });
        canvasController.canvasElem.addEventListener('pointermove', (event) => {
            this.handleDrag(event);
        });
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
    handlePointerDown(event) {
        this.pointerDraw(event);
    }
    handleDrag(event) {
        this.pointerDraw(event);
    }
    pointerDraw(event) {
        if (event.buttons === 1) {
            const correctedX = event.x - 9;
            const correctedY = event.y - 9;
            this.paint(112);
        }
    }
}
export const interactionController = new InteractionController();
