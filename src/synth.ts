// From https://www.w3.org/TR/webmidi/

class Synth {
  context = null;   // the Web Audio "context" object
  oscillator = null;  // the single oscillator
  envelope = null;    // the envelope for the single oscillator
  attack = 0.05;      // attack speed
  release = 0.05;   // release speed
  portamento = 0.05;  // portamento/glide speed
  activeNotes = []; // the stack of actively-pressed keys

  constructor() {
    this.context = new AudioContext();

        // set up the basic oscillator chain, muted to begin with.
    this.oscillator = this.context.createOscillator();
    this.oscillator.frequency.setValueAtTime(110, 0);
    this.envelope = this.context.createGain();
    this.oscillator.connect(this.envelope);
    this.envelope.connect(this.context.destination);
    this.envelope.gain.value = 0.0;  // Mute the sound
    this.oscillator.start(0);  // Go ahead and start up the oscillator
  }

  frequencyFromNoteNumber(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  noteOn(noteNumber) {
    this.activeNotes.push(noteNumber);
    this.oscillator.frequency.cancelScheduledValues(0);
    this.oscillator.frequency.setTargetAtTime(this.frequencyFromNoteNumber(noteNumber), 0, this.portamento);
    this.envelope.gain.cancelScheduledValues(0);
    this.envelope.gain.setTargetAtTime(1.0, 0, this.attack);
  }

  noteOff(noteNumber) {
    var position = this.activeNotes.indexOf(noteNumber);
    if (position != -1) {
      this.activeNotes.splice(position, 1);
    }
    if (this.activeNotes.length == 0) {  // shut off the envelope
      this.envelope.gain.cancelScheduledValues(0);
      this.envelope.gain.setTargetAtTime(0.0, 0, this.release);
    } else {
      this.oscillator.frequency.cancelScheduledValues(0);
      this.oscillator.frequency.setTargetAtTime(this.frequencyFromNoteNumber(this.activeNotes[this.activeNotes.length - 1]), 0, this.portamento);
    }
  }
}

export const synth = new Synth();