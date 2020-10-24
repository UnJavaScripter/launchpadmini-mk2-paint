import { PaintAction } from './models.js'


class HistoryHandler {
  private _history: PaintAction[];
  private historyRedo: PaintAction[];

  constructor() {
    this._history = [];
    this.historyRedo = [];
  }

  getLastElem() {
    return this._history[this._history.length - 1];
  }

  // has(key: number) {
  //   return this._history.has(key);
  // }

  push(action: PaintAction) {
    if(this.historyRedo.length) {
      this.historyRedo = [];
    }

    this._history = [...this._history, action];

  }

  undo() {
    const historySize = this._history.length;
    if(historySize) {
      const lastHistoryElem = <PaintAction>this._history[historySize - 1];
      this.historyRedo = [...this.historyRedo, lastHistoryElem];
      this._history.pop();
    }
  }

  redo() {
    const historyRedoSize = this.historyRedo.length;
    if(historyRedoSize) {
      const lastHistoryRedoElem = <PaintAction>this.historyRedo[historyRedoSize - 1];
      this._history = [...this._history, lastHistoryRedoElem];
      this.historyRedo.pop();
    }
  }

  clear() {
    this._history = [];
    this.historyRedo = [];
  }

  get history() {
    return this._history;
  }

}

export const historyHandler = new HistoryHandler();