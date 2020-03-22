import { canvasController } from './canvas-controller.js';
import { launchpadController } from './launchpad-controller.js';
import { historyHandler } from './history-handler.js';
import { stateController } from './state-controller.js';
class EventDispatcher {
    constructor() {
        this.controlKeys = new Map([
            [8, { color: 5 }],
            [24, { color: 15 }],
            [40, { color: 23 }],
            [56, { color: 35 }],
            [72, { color: 25 }],
            [88, { color: 54 }],
            [104, { color: 61 }],
            [120, { color: 60 }],
        ]);
        this.launchpadCanvasEQTable = new Map();
        this.litKeys = new Map();
        for (let key = 0; key <= 119; key++) {
            if (key <= 7) {
                this.launchpadCanvasEQTable.set(key, [key, 0]);
            }
            else if (key > 7 && key <= 23 - 8) {
                this.launchpadCanvasEQTable.set(key + 8, [(key - 8), 1]);
            }
            else if (key > 23 && key <= 39 - 8) {
                this.launchpadCanvasEQTable.set(key + 8, [(key - 24), 2]);
            }
            else if (key > 39 && key <= 55 - 8) {
                this.launchpadCanvasEQTable.set(key + 8, [(key - 40), 3]);
            }
            else if (key > 55 && key <= 71 - 8) {
                this.launchpadCanvasEQTable.set(key + 8, [(key - 56), 4]);
            }
            else if (key > 71 && key <= 87 - 8) {
                this.launchpadCanvasEQTable.set(key + 8, [(key - 72), 5]);
            }
            else if (key > 87 && key <= 103 - 8) {
                this.launchpadCanvasEQTable.set(key + 8, [(key - 88), 6]);
            }
            else if (key > 103 && key <= 119 - 8) {
                this.launchpadCanvasEQTable.set(key + 8, [(key - 104), 7]);
            }
        }
    }
    get selectedPaintColor() {
        return this._selectedPaintColor;
    }
    paint(key, color = this.selectedPaintColor, skipHistory = true) {
        stateController.activePixels.set(key, { color });
        if (!skipHistory) {
            historyHandler.push({ action: 144, key, color });
        }
        this.handlePixelPaint(key, color);
    }
    paintFromCoords(x, y) {
        // const pixelXstart = x - (x % canvasController.pixelSize.x);
        // const pixelYstart = y - (y % canvasController.pixelSize.y);
        // console.log(`::: original coords ${x}, ${y}`)
        // console.log(`::: converted coords ${pixelXstart}, ${pixelYstart}`)
        canvasController.drawPixel(x, y);
    }
    erase(key, skipHistory = false) {
        stateController.activePixels.delete(key);
        if (!skipHistory) {
            historyHandler.push({ action: 0, key, color: 0 });
        }
        this.handlePixelErase(key);
    }
    repaint() {
        this.clearAllPaint();
        historyHandler.history.forEach(historyElem => {
            if (historyElem.color) {
                this.paint(historyElem.key, historyElem.color, true);
            }
            else {
                this.erase(historyElem.key, true);
            }
        });
        this.paintControlKeys();
    }
    clearAllPaint() {
        for (let i = 0; i <= 120; i++) {
            this.erase(i, true);
        }
    }
    paintControlKeys() {
        this.controlKeys.forEach((controlKey, index) => {
            this.paint(index, controlKey.color, true);
        });
    }
    handleControlKey(key) {
        this._selectedPaintColor = this.controlKeys.get(key).color;
        let now = window.performance.now();
        let isOn = false;
        const rafCB = () => {
            if (window.performance.now() >= now + 600) {
                if (isOn) {
                    this.erase(this.selectedControlKey, true);
                    isOn = false;
                }
                else {
                    this.paint(this.selectedControlKey, this._selectedPaintColor, true);
                    isOn = true;
                }
                now = window.performance.now();
            }
            this.pulseRaf = window.requestAnimationFrame(rafCB);
        };
        if (!this.selectedControlKey) {
            this.selectedControlKey = key;
            this.pulseRaf = window.requestAnimationFrame(rafCB);
        }
        else {
            this.paintControlKeys();
            this.selectedControlKey = key;
            window.cancelAnimationFrame(this.pulseRaf);
            this.pulseRaf = window.requestAnimationFrame(rafCB);
        }
    }
    handlePixelPaint(key, color) {
        launchpadController.paint(key, color);
        const pixelCanvasLocation = this.launchpadCanvasEQTable.get(key);
        if (pixelCanvasLocation) {
            canvasController.drawPixel(pixelCanvasLocation[0], pixelCanvasLocation[1]);
        }
    }
    handlePixelErase(key) {
        launchpadController.erase(key);
    }
}
export const eventDispatcher = new EventDispatcher();
