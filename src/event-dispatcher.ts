import { canvasController } from './canvas-controller.js';
import { launchpadController } from './launchpad-controller.js';
import { historyHandler } from './history-handler.js';
import { KeyColor } from './models';
import { stateController } from './state-controller.js';

class EventDispatcher {

  controlKeys: Map<number, KeyColor> = new Map([
    [8, { color: 5 }],
    [24, { color: 15 }],
    [40, { color: 23 }],
    [56, { color: 35 }],
    [72, { color: 25 }],
    [88, { color: 54 }],
    [104, { color: 61 }],
    [120, { color: 60 }],
  ]);
  private _selectedPaintColor: number;
  selectedControlKey: number;
  pulseRaf: number;
  litKeys: Map<number, KeyColor> = new Map();

  constructor() {
  }

  get selectedPaintColor() {
    return this._selectedPaintColor;
  }

  paint(key: number, color: number = this.selectedPaintColor, skipHistory = true) {
    stateController.activePixels.set(key, { color });

    if (!skipHistory) {
      historyHandler.push({ action: 144, key, color });
    }
    this.handlePixelPaint(key, color);
  }

  erase(key: number, skipHistory = false) {
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
      } else {
        this.erase(historyElem.key, true);
      }
    });
    this.paintControlKeys();
  }

  clearAllPaint() { // fixxx
    for (let i = 0; i <= 120; i++) {
      this.erase(i, true);
    }
  }

  paintControlKeys() {
    this.controlKeys.forEach((controlKey, index) => {
      this.paint(index, controlKey.color, true);
    })
  }

  handleControlKey(key) {
    this._selectedPaintColor = this.controlKeys.get(key).color;
    let now = window.performance.now();
    let isOn = false;

    const rafCB = () => {
      if (window.performance.now() >= now + 600) {
        if (isOn) {
          this.erase(this.selectedControlKey);
          isOn = false
        } else {
          this.paint(this.selectedControlKey, this._selectedPaintColor);
          isOn = true
        }
        now = window.performance.now();
      }
      this.pulseRaf = window.requestAnimationFrame(rafCB);
    }
    if (!this.selectedControlKey) {
      this.selectedControlKey = key;
      this.pulseRaf = window.requestAnimationFrame(rafCB);
    } else {
      this.paintControlKeys();
      this.selectedControlKey = key;
      window.cancelAnimationFrame(this.pulseRaf);
      this.pulseRaf = window.requestAnimationFrame(rafCB);
    }
  }

  private handlePixelPaint(key: number, color: number) {
    launchpadController.paint(key, color);
  }
  
  private handlePixelErase(key: number) {
    launchpadController.erase(key);
  }
}

export const eventDispatcher = new EventDispatcher();