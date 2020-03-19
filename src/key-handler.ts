const historyHandler = new HistoryHandler();
interface KeyColor {
  color: number
}
class KeyHandler {
  selectedPaintColor: number;
  selectedControlKey: number;
  pulseRaf: number;
  litKeys: Map<number, KeyColor> = new Map();
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

  handleUserAction(midiOut: WebMidi.MIDIOutput, key: number, color: number = this.selectedPaintColor, skipHistory = false) {
    if (this.litKeys.has(key) && this.litKeys.get(key).color === color) {
      this.litKeys.delete(key);
      this.erase(midiOut, key, skipHistory);
    } else {
      this.litKeys.set(key, { color });
      this.paint(midiOut, key, color, skipHistory);
    }
  }

  private paint(midiOut: WebMidi.MIDIOutput, key: number, color: number, skipHistory = false) {
    if (!skipHistory) {
      historyHandler.push({ action: 144, key, color });
    }
    midiOut.send([144, key, color]);
  }


  private erase(midiOut: WebMidi.MIDIOutput, key: number, skipHistory = false) {
    if (!skipHistory) {
      historyHandler.push({ action: 0, key, color: 0 });
    }
    midiOut.send([128, key, 0]);
  }

  repaint(midiOut: WebMidi.MIDIOutput) {
    this.clearAllPaint();
    historyHandler.history.forEach(historyElem => {
      if (historyElem.color) {
        this.paint(midiOut, historyElem.key, historyElem.color, true);
      } else {
        this.erase(midiOut, historyElem.key, true);
      }
    });
    this.paintControlKeys();
  }

  clearAllPaint() { // fixxx
    for (let i = 0; i <= 120; i++) {
      this.erase(midiOut, i, true);
    }
  }

  paintControlKeys() {
    this.controlKeys.forEach((controlKey, index) => {
      this.paint(midiOut, index, controlKey.color, true);
    })
  }

  handleControlKey(key) {
    this.selectedPaintColor = this.controlKeys.get(key).color;
    let now = window.performance.now();
    let isOn = false;

    const rafCB = () => {
      if (window.performance.now() >= now + 600) {
        if (isOn) {
          midiOut.send([144, this.selectedControlKey, 0]);
          isOn = false
        } else {
          midiOut.send([144, this.selectedControlKey, this.selectedPaintColor]);
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
}
