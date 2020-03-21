import { KeyColor } from './models.js'

class StateController {
  private _midiOutput : WebMidi.MIDIOutput;
  private _activePixels : Map<number, KeyColor> = new Map();

  get activePixels() {
    return this._activePixels;
  }

  async setMidiOutput(midiOutput: WebMidi.MIDIOutput) {
    return new Promise((resolve, reject) => {
      if(!midiOutput) {
        return reject('no midi output provided');
      }
      this._midiOutput = midiOutput;
      resolve(this.midiOutput);
    })
  }

  get midiOutput() {
    return this._midiOutput;
  }
}

export const stateController = new StateController()