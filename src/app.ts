const keyHandler = new KeyHandler();
const synth = new Synth();
let midiAccess = null;
let midiOut;

window.addEventListener('load', function () {

  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({ sysex: true }).then(onMIDIInit, onMIDIReject);
  }
  else {
    console.error("No MIDI support present in your browser.  You're gonna have a bad time.")
  }

  window.addEventListener('keydown', (event: KeyboardEvent) => {
    handleKeyUp(event);
  });

  function handleKeyUp(event: KeyboardEvent) {
    if (event.keyCode === 89) {
      if (event.ctrlKey) {
        historyHandler.redo();
        keyHandler.repaint(midiOut);
      }
    }
    if (event.keyCode === 90) {
      if (event.ctrlKey) {
        historyHandler.undo();
        keyHandler.repaint(midiOut);
      }
    }
  }
});

function onMIDIInit(midiAccess: WebMidi.MIDIAccess) {
  let haveAtLeastOneDevice = false;
  for (let input of midiAccess.inputs.values()) {
    input.onmidimessage = MIDIMessageEventHandler;
    haveAtLeastOneDevice = true;
  }
  for (let output of midiAccess.outputs.values()) {
    midiOut = output;
  }
  keyHandler.clearAllPaint();
  keyHandler.paintControlKeys();
  keyHandler.handleControlKey(120);

  if (!haveAtLeastOneDevice) {
    console.error("No MIDI input devices present.  You're gonna have a bad time.");
  }
}

function onMIDIReject(err) {
  console.error("The MIDI system failed to start.  You're gonna have a bad time.");
}



function MIDIMessageEventHandler(event) {
  const key = event.data[1];
  const velocity = event.data[2];
  const isControlKey = keyHandler.controlKeys.has(key);
    if(isControlKey && velocity) {
    keyHandler.handleControlKey(key);
    return;
  }
  if (velocity == 127 && !isControlKey) {
    keyHandler.handleUserAction(midiOut, key);
  }

  // Mask off the lower nibble (MIDI channel, which we don't care about)
  switch (event.data[0] & 0xf0) {
    case 0x90:
      if (event.data[2] != 0) {  // if velocity != 0, this is a note-on message
        synth.noteOn(event.data[1]);
        return;
      }
    // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
    case 0x80:
      synth.noteOff(event.data[1]);
      return;
  }
}
