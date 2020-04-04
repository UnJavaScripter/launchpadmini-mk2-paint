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
import { serialController } from './serial-controller.js';
class App {
    constructor() {
        window.addEventListener('DOMContentLoaded', () => __awaiter(this, void 0, void 0, function* () {
            const serialConnectionButton = document.getElementById('serial-connection-btn');
            const clearAllButton = document.getElementById('clear-btn');
            clearAllButton.addEventListener('pointerdown', () => {
                eventDispatcher.clearAll();
            });
            launchpadController.init();
            canvasController.init();
            serialController.init(serialConnectionButton);
            eventDispatcher.setSelectedPaintColor(60);
        }));
    }
}
new App();
