import { canvasController } from './canvas-controller.js';
import { eventDispatcher } from './event-dispatcher.js';
import { launchpadController } from './launchpad-controller.js';
import { serialController } from './serial-controller.js';

class App {
  constructor() {
    window.addEventListener('DOMContentLoaded', async () => {
      const serialConnectionButton = document.getElementById('serial-connection-btn');
      const clearAllButton = document.getElementById('clear-btn');
      clearAllButton.addEventListener('pointerdown', () => {
        eventDispatcher.clearAll();
      });
      launchpadController.init();
      canvasController.init();
      serialController.init(serialConnectionButton);
      eventDispatcher.setSelectedPaintColor(60);
    });
  }
}
new App();