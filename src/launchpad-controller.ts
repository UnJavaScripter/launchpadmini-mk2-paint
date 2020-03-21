import { stateController } from './state-controller.js';

class LaunchpadController {
  midiOut: WebMidi.MIDIOutput;
  constructor() {
    
  }

  paint(key: number, color: number) {
    this.midiOut = this.midiOut || stateController.midiOutput;
    this.midiOut.send([144, key, color]);
  }


  erase(key: number) {
    this.midiOut = this.midiOut || stateController.midiOutput;
    this.midiOut.send([128, key, 0]);
  }

  
}

export const launchpadController = new LaunchpadController()