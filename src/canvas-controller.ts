import { eventDispatcher } from "./event-dispatcher.js";

class CanvasController {
  private _canvasElem: HTMLCanvasElement;
  now: number = 0;
  private ctx: CanvasRenderingContext2D;
  pixelSize: any;
  private lastDrawnPixel: any;
  private controlColumnColors =["#e4585d", "#e22323", "#e46c58", "#ff8b5e", "#e0a448", "#d4b336", "#e8dd51", "#5bdc60"]
  canvasColors = {border: '#555', background: '#666'}
  constructor() {
    this._canvasElem = <HTMLCanvasElement>document.getElementById('canvas');
    this.ctx = <CanvasRenderingContext2D>this.canvasElem.getContext('2d');

    //
    const dpi = window.devicePixelRatio;
    const style_width = Number(getComputedStyle(this.canvasElem.parentElement).getPropertyValue("width").slice(0, -2));
    const style_height = Number(getComputedStyle(this.canvasElem.parentElement).getPropertyValue("height").slice(0, -2));
    this.canvasElem.setAttribute('width', String(style_width * dpi));
    this.canvasElem.setAttribute('height', String((style_height*7) * dpi));
    //
    
    this.pixelSize = {
      x: this.canvasElem.width / 9,
      y: this.canvasElem.height/ 8,
    };
    

    this.lastDrawnPixel = {};

    this.canvasElem.addEventListener('pointerdown', (event: PointerEvent) => {
      this.handlePointerDown(event);
    });

    this.canvasElem.addEventListener('pointermove', (event: PointerEvent) => {
      this.handleDrag(event);
    });
  }

  get canvasElem() {
    return this._canvasElem;
  }

  init() {
    this.drawGrid();
  }

  private handlePointerDown(event: MouseEvent) {
    this.pointerDraw(event);
  }

  private handleDrag(event: MouseEvent) {
    this.pointerDraw(event);
  }

  private pointerDraw(event: MouseEvent) {
    if (event.buttons === 1) {
      const x = event.clientX - canvasController.canvasElem.getBoundingClientRect().left
      const y = event.clientY - canvasController.canvasElem.getBoundingClientRect().top
      const col = Math.floor(x/this.pixelSize.x);
      const row = Math.floor(y/this.pixelSize.y);
      if((event.movementX !== 0 || event.movementY !== 0) && this.lastDrawnPixel.col === col && this.lastDrawnPixel.row === row) {
        return
      }
      
      if(col >= (this.canvasElem.width / this.pixelSize.x) - 1) {
        eventDispatcher.handleControlKeyFromCanvas(row);
      } else {
        eventDispatcher.paintFromCanvas(row, col);
      }
    }
  }

  drawPixel(row: number, col: number, color?) {
    // Protect the control keys
    if(col === 8) {
      return;
    }
    if(!color) {
      color = this.canvasColors.background;
    }

    const pixelXstart = col * this.pixelSize.x;
    const pixelYstart = row * this.pixelSize.y;


    this.lastDrawnPixel.col = col;
    this.lastDrawnPixel.row = row;
    this.lastDrawnPixel.x = pixelXstart;
    this.lastDrawnPixel.y = pixelYstart;
    this.lastDrawnPixel.color = color;

    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = this.canvasColors.border;
    this.ctx.fillRect(pixelXstart, pixelYstart, this.pixelSize.x, this.pixelSize.y);
    this.ctx.stroke();
    // this.ctx.fillText(`${pixelXstart}, ${pixelYstart}`, pixelXstart, pixelYstart, 800);
  }

  erase(row: number, col: number) {
    this.drawPixel(row, col);
  }

  private drawGrid() {
    this.ctx.fillStyle = this.canvasColors.background;
    this.ctx.strokeStyle = this.canvasColors.border;

    this.ctx.fillRect(0, 0, this.canvasElem.width, this.canvasElem.height);
    this.ctx.strokeRect(0, 0, this.canvasElem.width, this.canvasElem.height);

    this.ctx.strokeStyle = this.canvasColors.border;
    this.ctx.beginPath();
    
    for (let i = 0; i <= this.canvasElem.width; i += this.pixelSize.x) {
      
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.canvasElem.height);
    }
    for (let i = 0; i <= this.canvasElem.height; i += this.pixelSize.y) {
      // Control column      
      const rowNumber  = Math.floor(i/this.pixelSize.y);
      this.ctx.fillStyle = this.controlColumnColors[rowNumber];
      this.ctx.fillRect(this.canvasElem.width - this.pixelSize.x, i, this.pixelSize.x , this.pixelSize.y );

      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.canvasElem.width, i);
    }
    this.ctx.stroke();
  }
  // ranDraw(pixelAmount: number) {
  //   let lastX = 0;
  //   let lastY = 0;
  //   for (let i = 0; i <= pixelAmount; i++) {
  //     const x = Math.floor(Math.random() * lastX || this.canvasElem.width);
  //     const y = Math.floor(Math.random() * lastY || this.canvasElem.height);
  //     this.drawPixel(x, y);
  //     if (lastX <= 0) {
  //       lastX = x;
  //       lastY = y;
  //     }
  //   }
  // }

  clear() {
    this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
    this.drawGrid();
  }

}

export const canvasController = new CanvasController();