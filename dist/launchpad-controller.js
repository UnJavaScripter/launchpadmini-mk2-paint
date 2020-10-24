import { eventDispatcher } from './event-dispatcher.js';
class LaunchpadController {
    constructor() {
        this.controlKeys = new Map([
            [8, { color: 5, row: 0, col: 8 }],
            [24, { color: 15, row: 1, col: 8 }],
            [40, { color: 23, row: 2, col: 8 }],
            [56, { color: 35, row: 3, col: 8 }],
            [72, { color: 25, row: 4, col: 8 }],
            [88, { color: 54, row: 5, col: 8 }],
            [104, { color: 61, row: 6, col: 8 }],
            [120, { color: 60, row: 7, col: 8 }],
        ]);
    }
    init() {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess({ sysex: true }).then(this.onMIDIInit.bind(this), this.onMIDIReject);
        }
        else {
            console.error("No MIDI support present in your browser.  You're gonna have a bad time.");
        }
    }
    onMIDIInit(midiAccess) {
        let isNovationLaunchpadMini = false;
        let isNovationLaunchpadMiniMK2 = false;
        for (let input of midiAccess.inputs.values()) {
            input.onmidimessage = this.MIDIMessageEventHandler.bind(this);
            isNovationLaunchpadMini = input.name.includes('Launchpad Mini');
            isNovationLaunchpadMiniMK2 = input.name === 'Launchpad Mini 4 MIDI 1';
        }
        for (let output of midiAccess.outputs.values()) {
            this.midiOut = output;
        }
        if (!isNovationLaunchpadMiniMK2 && isNovationLaunchpadMini) {
            console.warn('This launchpad MAY behave similarly to the MK2, but things may fail');
        }
        if (!isNovationLaunchpadMini) {
            console.error("It seems like you don't have a Launchpad Mini MK2 connected. This demo only makes sense with one of those.");
            alert("It seems like you don't have a Launchpad Mini MK2 connected. This demo only makes sense with one of those.");
            return;
        }
        this.clear();
        this.paintControlKeys();
    }
    onMIDIReject(err) {
        console.error("The MIDI system failed to start.  You're gonna have a bad time.", err);
    }
    MIDIMessageEventHandler(event) {
        const status = event.data[0];
        const key = event.data[1];
        const velocity = event.data[2];
        const isControlKey = this.controlKeys.has(key);
        eventDispatcher.handleLaunchpadKey(status, key, velocity, isControlKey);
    }
    paint(key, color) {
        this.midiOut.send([144, key, color]);
    }
    erase(key) {
        this.midiOut.send([128, key, 0]);
    }
    clear() {
        for (let i = 0; i <= 120; i++) {
            this.erase(i);
        }
        this.paintControlKeys();
    }
    paintControlKeys() {
        this.controlKeys.forEach((controlKey, index) => {
            this.paint(index, controlKey.color);
        });
    }
}
export const launchpadController = new LaunchpadController();
