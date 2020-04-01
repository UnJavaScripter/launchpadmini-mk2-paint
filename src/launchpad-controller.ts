import { KeyProps } from './models.js';
import { eventDispatcher } from './event-dispatcher.js';

class LaunchpadController {
  midiOut: WebMidi.MIDIOutput;
  controlKeys: Map<number, KeyProps>;

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

  onMIDIInit(midiAccess: WebMidi.MIDIAccess) {
    let haveAtLeastOneDevice = false;
    for (let input of midiAccess.inputs.values()) {
      input.onmidimessage = this.MIDIMessageEventHandler.bind(this);
      haveAtLeastOneDevice = true;
    }
    for (let output of midiAccess.outputs.values()) {
      this.midiOut = output;
    }
    if (!haveAtLeastOneDevice) {
      console.error("Couldn't find any MIDI device");
    }
    this.clearLaunchpad();
    this.paintControlKeys();
  
  }

  onMIDIReject(err: string) {
    console.error("The MIDI system failed to start.  You're gonna have a bad time.", err);
  }

  MIDIMessageEventHandler(event) {
    const status = event.data[0];
    const key = event.data[1];
    const velocity = event.data[2];
    const isControlKey = this.controlKeys.has(key);
    eventDispatcher.handleLaunchpadKey(status, key, velocity, isControlKey);
  }

  paint(key: number, color: number) {
    this.midiOut.send([144, key, color]);
  }

  erase(key: number) {
    this.midiOut.send([128, key, 0]);
  }

  clearLaunchpad() {
    for (let i = 0; i <= 120; i++) {
      this.erase(i);
    }
  }

  paintControlKeys() {
    this.controlKeys.forEach((controlKey, index) => {
      this.paint(index, controlKey.color);
    });
  }

  
}

export const launchpadController = new LaunchpadController()