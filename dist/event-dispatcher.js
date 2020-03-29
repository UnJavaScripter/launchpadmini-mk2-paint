import { canvasController } from './canvas-controller.js';
import { launchpadController } from './launchpad-controller.js';
// import { historyHandler } from './history-handler.js';
import { stateController } from './state-controller.js';
import { Synth } from './synth.js';
const synth = new Synth();
class EventDispatcher {
    constructor() {
        this.colorsEQtable = new Map([
            [5, "#e4585d"],
            [15, "#e22323"],
            [23, "#e46c58"],
            [35, "#ff8b5e"],
            [25, "#e0a448"],
            [54, "#d4b336"],
            [61, "#e8dd51"],
            [60, "#5bdc60"],
        ]);
        this.launchpadCanvasEQTable = new Map();
        this.coordsAndKeys = [];
        this.coordsAndKeys = [
            [0, 1, 2, 3, 4, 5, 6, 7],
            [16, 17, 18, 19, 20, 21, 22, 23],
            [32, 33, 34, 35, 36, 37, 38, 39],
            [48, 49, 50, 51, 52, 53, 54, 55],
            [64, 65, 66, 67, 68, 69, 70, 71],
            [80, 81, 82, 83, 84, 85, 86, 87],
            [96, 97, 98, 99, 100, 101, 102, 103],
            [112, 113, 114, 115, 116, 117, 118, 119]
        ];
    }
    paintFromLaunchpad(key, color = stateController.selectedPaintColor) {
        for (let row = 0; row < this.coordsAndKeys.length; row++) {
            for (let col = 0; col < this.coordsAndKeys[row].length; col++) {
                if (this.coordsAndKeys[row][col] === key) {
                    this.paintToAll(row, col);
                    return;
                }
            }
        }
    }
    paintToAll(row, col) {
        const selectedColorId = stateController.selectedPaintColor;
        const selectedColorHex = this.colorsEQtable.get(stateController.selectedPaintColor);
        stateController.activePixels.set(this.coordsAndKeys[row][col], { color: selectedColorId, row, col });
        canvasController.drawPixel(row, col, selectedColorHex);
        launchpadController.paint(this.coordsAndKeys[row][col], selectedColorId);
    }
    paintFromCanvas(row, col) {
        const key = this.coordsAndKeys[row][col];
        if (stateController.activePixels.has(key)) {
            this.erase(row, col);
        }
        else {
            this.paintToAll(row, col);
        }
    }
    erase(row, col) {
        const key = this.coordsAndKeys[row][col];
        stateController.activePixels.delete(key);
        launchpadController.erase(key);
        canvasController.erase(row, col);
    }
    handleLaunchpadKey(status, key, velocity, isControlKey) {
        if (isControlKey && velocity) {
            eventDispatcher.handleControlKey(key);
            return;
        }
        if (velocity == 127 && !isControlKey) {
            const keyIsActive = stateController.activePixels.has(key);
            if (keyIsActive) {
                const keyRef = stateController.activePixels.get(key);
                this.erase(keyRef.row, keyRef.col);
            }
            else {
                this.paintFromLaunchpad(key);
            }
        }
        // Mask off the lower nibble (MIDI channel, which we don't care about)
        switch (status & 0xf0) {
            case 0x90:
                if (velocity != 0) { // if velocity != 0, this is a note-on message
                    synth.noteOn(key);
                    return;
                }
            // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
            case 0x80:
                synth.noteOff(key);
                return;
        }
    }
    setSelectedPaintColor(colorId) {
        stateController.selectedPaintColor = colorId;
    }
    handleControlKeyFromCanvas(row) {
        row++;
        this.setSelectedPaintColor(launchpadController.controlKeys.get(8 * (2 * row - 1)).color);
        console.info(launchpadController.controlKeys.get(8 * (2 * row - 1)).color);
    }
    handleControlKey(key) {
        const keyRef = launchpadController.controlKeys.get(key);
        this.setSelectedPaintColor(keyRef.color);
        let now = window.performance.now();
        let isOn = false;
        const blinkControlKey = () => {
            if (window.performance.now() >= now + 600) {
                if (isOn) {
                    this.erase(keyRef.row, keyRef.col);
                    isOn = false;
                }
                else {
                    this.paintFromLaunchpad(this.selectedControlKey, stateController.selectedPaintColor);
                    isOn = true;
                }
                now = window.performance.now();
            }
            this.pulseRaf = window.requestAnimationFrame(blinkControlKey);
        };
        if (!this.selectedControlKey) {
            this.selectedControlKey = key;
            this.pulseRaf = window.requestAnimationFrame(blinkControlKey);
        }
        else {
            launchpadController.paintControlKeys();
            this.selectedControlKey = key;
            window.cancelAnimationFrame(this.pulseRaf);
            this.pulseRaf = window.requestAnimationFrame(blinkControlKey);
        }
    }
}
export const eventDispatcher = new EventDispatcher();
