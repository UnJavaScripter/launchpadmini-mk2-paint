import { canvasController } from './canvas-controller.js';
import { historyHandler } from './history-handler.js';
import { eventDispatcher } from './event-dispatcher.js';
import { stateController } from './state-controller.js';
import { launchpadController } from './launchpad-controller.js';

class App {
  constructor() {
    window.addEventListener('load', async () => {

      launchpadController.init();
      canvasController.init();
      eventDispatcher.setSelectedPaintColor(60);
      
    
      window.addEventListener('keydown', (event: KeyboardEvent) => {
        handleKeyUp(event);
      });
    
      function handleKeyUp(event: KeyboardEvent) {
        // if (event.keyCode === 89) {
        //   if (event.ctrlKey) {
        //     historyHandler.redo();
        //     eventDispatcher.repaint();
        //   }
        // }
        // if (event.keyCode === 90) {
        //   if (event.ctrlKey) {
        //     historyHandler.undo();
        //     eventDispatcher.repaint();
        //   }
        // }
      }
    });
  }
}
new App();