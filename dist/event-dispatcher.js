import { canvasController } from './canvas-controller.js';
import { launchpadController } from './launchpad-controller.js';
import { stateController } from './state-controller.js';
import { synth } from './synth.js';
import { serialController } from './serial-controller.js';
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
    paintFromLaunchpad(key, isControlKey = false) {
        for (let row = 0; row < this.coordsAndKeys.length; row++) {
            for (let col = 0; col < this.coordsAndKeys[row].length; col++) {
                if (this.coordsAndKeys[row][col] === key) {
                    this.paintToAll(row, col, isControlKey);
                    return;
                }
            }
        }
    }
    paintToAll(row, col, isControlKey = false) {
        const selectedColorId = stateController.selectedPaintColor;
        const selectedColorHex = this.colorsEQtable.get(stateController.selectedPaintColor);
        if (!isControlKey) {
            stateController.activePixels.set(this.coordsAndKeys[row][col], { color: selectedColorId, row, col });
        }
        canvasController.drawPixel(row, col, selectedColorHex);
        launchpadController.paint(this.coordsAndKeys[row][col], selectedColorId);
        this.handleLEDMatrixPainting();
    }
    paintFromCanvas(row, col) {
        const key = this.coordsAndKeys[row][col];
        const keyThatIsOn = stateController.activePixels.get(key);
        let syntRAF;
        if (keyThatIsOn && keyThatIsOn.color === stateController.selectedPaintColor) {
            console.log('borrando');
            this.erase(row, col);
        }
        else {
            console.log('pintando');
            this.paintToAll(row, col);
        }
        this.handleSynth(144, key, 127);
        this.now = performance.now();
        const stopSynthSoundRAF = (() => {
            if (performance.now() >= this.now + 170) {
                this.handleSynth(144, key, 0);
                window.cancelAnimationFrame(syntRAF);
            }
            else {
                syntRAF = window.requestAnimationFrame(stopSynthSoundRAF);
            }
        });
        syntRAF = window.requestAnimationFrame(stopSynthSoundRAF);
    }
    erase(row, col) {
        const key = this.coordsAndKeys[row][col];
        stateController.activePixels.delete(key);
        launchpadController.erase(key);
        canvasController.erase(row, col);
        this.handleLEDMatrixPainting();
    }
    clearAll() {
        stateController.clearActivePixels();
        serialController.clear();
        launchpadController.clear();
        canvasController.clear();
    }
    handleLaunchpadKey(status, key, velocity, isControlKey) {
        if (isControlKey && velocity) {
            eventDispatcher.handleControlKey(key);
            return;
        }
        if (velocity == 127 && !isControlKey) {
            const keyThatIsOn = stateController.activePixels.get(key);
            if (keyThatIsOn && keyThatIsOn.color === stateController.selectedPaintColor) {
                const keyRef = stateController.activePixels.get(key);
                console.log('mandnando a borrar');
                this.erase(keyRef.row, keyRef.col);
            }
            else {
                this.paintFromLaunchpad(key);
            }
        }
        this.handleSynth(status, key, velocity);
    }
    handleSynth(status, key, velocity) {
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
        // const blinkControlKey = () => {
        //   if (window.performance.now() >= now + 600) {
        //     if (isOn) {
        //       this.erase(keyRef.row, keyRef.col);
        //       console.log('blinkOff')
        //       isOn = false;
        //     } else {
        //       this.paintFromLaunchpad(this.selectedControlKey, true);
        //       console.log('blinkOn')
        //       isOn = true;
        //     }
        //     now = window.performance.now();
        //   }
        //   this.pulseRaf = window.requestAnimationFrame(blinkControlKey);
        // }
        // if (!this.selectedControlKey) {
        //   console.log('!this.selectedControlKey')
        //   this.selectedControlKey = key;
        //   this.pulseRaf = window.requestAnimationFrame(blinkControlKey);
        // } else {
        //   console.log('this.selectedControlKey')
        //   launchpadController.paintControlKeys();
        //   this.selectedControlKey = key;
        //   window.cancelAnimationFrame(this.pulseRaf);
        //   this.pulseRaf = window.requestAnimationFrame(blinkControlKey);
        // }
    }
    handleLEDMatrixPainting() {
        if (serialController.isConnected()) {
            serialController.clear();
            stateController.activePixels.forEach((pixelProps) => {
                serialController.write(`${Math.abs(pixelProps.col - 7)},${Math.abs(pixelProps.row)}`);
            });
        }
    }
}
export const eventDispatcher = new EventDispatcher();
