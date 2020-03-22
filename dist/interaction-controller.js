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
            const correctedX = event.x;
            const correctedY = event.y;
            const x = event.clientX - canvasController.canvasElem.getBoundingClientRect().left;
            const y = event.clientY - canvasController.canvasElem.getBoundingClientRect().top;
            eventDispatcher.paintFromCoords(x / 2, y / 2);
        }
    }
}
export const interactionController = new InteractionController();
