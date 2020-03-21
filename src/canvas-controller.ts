class CanvasController {
  private _canvasElem: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private pixelSize: number;
  private lastDrawnPixel: any;
  private selectedColor: string;
  // drawning: Drawning;

  constructor(pixelSize = 50, width = window.innerWidth, height = window.innerHeight - 4) {
    this._canvasElem = <HTMLCanvasElement>document.getElementById('canvas');
    this.ctx = <CanvasRenderingContext2D>this.canvasElem.getContext('2d');
    this.pixelSize = pixelSize;
    this.canvasElem.width = width;
    this.canvasElem.height = height;
    this.lastDrawnPixel = {};
    // this.selectedColor = colorPicker.selectedColor;

    // this.drawning = {fileHandle: undefined};

    this.init();
  }

  get canvasElem() {
    return this._canvasElem;
  }


  init() {
    this.drawGrid();
    // this.ranDraw(20)
  }

  private drawPixel(x: number, y: number, color = 'rebeccapurple', isHistoryEvent = false) {
    const pixelXstart = x - (x % this.pixelSize);
    const pixelYstart = y - (y % this.pixelSize);

    if(pixelXstart === this.lastDrawnPixel.x && pixelYstart === this.lastDrawnPixel.y && color === this.lastDrawnPixel.color) {
      return;
    }

    this.lastDrawnPixel.x = pixelXstart;
    this.lastDrawnPixel.y = pixelYstart;
    this.lastDrawnPixel.color = color;
    
    this.ctx.fillStyle = color;
    this.ctx.fillRect(pixelXstart, pixelYstart, this.pixelSize, this.pixelSize);
    
    // this.ctx.fillText(`${pixelXstart}, ${pixelYstart}`, pixelXstart, pixelYstart, 800);
  }
  private drawGrid() {
    this.ctx.fillStyle = '#666';
    this.ctx.strokeStyle = '#0ff';

    this.ctx.fillRect(0, 0, this.canvasElem.width, this.canvasElem.height);
    this.ctx.strokeRect(0, 0, this.canvasElem.width, this.canvasElem.height);

    this.ctx.strokeStyle = '#777';
    this.ctx.beginPath();
    for (let i = 0; i <= this.canvasElem.width; i += this.pixelSize) {
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.canvasElem.height);
    }
    for (let i = 0; i <= this.canvasElem.height; i += this.pixelSize) {
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

}

export const canvasController = new CanvasController();