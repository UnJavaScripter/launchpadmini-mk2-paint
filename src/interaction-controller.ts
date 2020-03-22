import { stateController } from './state-controller.js';
import { eventDispatcher } from './event-dispatcher.js';
import { canvasController } from './canvas-controller.js';


class InteractionController {
  private MockColorPicker = {selectedColor: 'limegreen'}

  constructor() {
    canvasController.canvasElem.addEventListener('pointerdown', (event: PointerEvent) => {
      this.handlePointerDown(event);
    });

    canvasController.canvasElem.addEventListener('pointermove', (event: PointerEvent) => {
      this.handleDrag(event);
    });
  }

  handleUserAction(key: number, skipHistory = false) {
    if (stateController.activePixels.has(key)) {
      this.erase(key, skipHistory);
    } else {
      this.paint(key, skipHistory);
    }
  }

  private erase(key: number, skipHistory = false) {
    eventDispatcher.erase(key);
  }

  private paint(key: number, skipHistory = false) {
    eventDispatcher.paint(key);
  }

  private handlePointerDown(event: MouseEvent) {
    this.pointerDraw(event);
  }

  private handleDrag(event: MouseEvent) {
    this.pointerDraw(event);
  }

  private pointerDraw(event: MouseEvent) {
    if (event.buttons === 1) {
      const correctedX = event.x;
      const correctedY = event.y;
      const x = event.clientX - canvasController.canvasElem.getBoundingClientRect().left
      const y = event.clientY - canvasController.canvasElem.getBoundingClientRect().top
      
      eventDispatcher.paintFromCoords(x/2, y/2)
    }
  }
}

export const interactionController = new InteractionController();
