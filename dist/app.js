var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { canvasController } from './canvas-controller.js';
import { eventDispatcher } from './event-dispatcher.js';
import { launchpadController } from './launchpad-controller.js';
class App {
    constructor() {
        window.addEventListener('load', () => __awaiter(this, void 0, void 0, function* () {
            launchpadController.init();
            canvasController.init();
            eventDispatcher.setSelectedPaintColor(60);
            window.addEventListener('keydown', (event) => {
                handleKeyUp(event);
            });
            function handleKeyUp(event) {
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
        }));
    }
}
new App();
