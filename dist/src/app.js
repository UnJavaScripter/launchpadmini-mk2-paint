const synth = new Synth();
const historyHandler = new HistoryHandler();
let midiAccess = null; // the MIDIAccess object.
let midiOut;
window.addEventListener('load', function () {
    if (navigator.requestMIDIAccess)
        navigator.requestMIDIAccess({ sysex: true }).then(onMIDIInit, onMIDIReject);
    else
        console.error("No MIDI support present in your browser.  You're gonna have a bad time.");
});
function onMIDIInit(midiAccess) {
    let haveAtLeastOneDevice = false;
    for (let input of midiAccess.inputs.values()) {
        input.onmidimessage = MIDIMessageEventHandler;
        haveAtLeastOneDevice = true;
    }
    for (let output of midiAccess.outputs.values()) {
        midiOut = output;
    }
    if (!haveAtLeastOneDevice) {
        console.error("No MIDI input devices present.  You're gonna have a bad time.");
    }
}
function onMIDIReject(err) {
    console.error("The MIDI system failed to start.  You're gonna have a bad time.");
}
const painted = new Set();
function MIDIMessageEventHandler(event) {
    console.log(event.data);
    const tecla = event.data[1];
    if (event.data[2] !== 0) {
        if (painted.has(tecla)) {
            painted.delete(tecla);
            midiOut.send([128, tecla, 0]);
        }
        else {
            painted.add(tecla);
            midiOut.send([144, tecla, 15]);
        }
    }
    // Mask off the lower nibble (MIDI channel, which we don't care about)
    switch (event.data[0] & 0xf0) {
        case 0x90:
            if (event.data[2] != 0) { // if velocity != 0, this is a note-on message
                synth.noteOn(event.data[1]);
                return;
            }
        // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
        case 0x80:
            synth.noteOff(event.data[1]);
            return;
    }
}
