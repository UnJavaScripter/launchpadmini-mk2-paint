class CanvasHandler {
    // drawning: Drawning;
    constructor(pixelSize = 50, width = window.innerWidth, height = window.innerHeight - 4) {
        this.canvasElem = document.getElementById('canvas');
        this.ctx = this.canvasElem.getContext('2d');
        this.pixelSize = pixelSize;
        this.canvasElem.width = width;
        this.canvasElem.height = height;
        // this.lastDrawnPixel = {};
        // this.selectedColor = colorPicker.selectedColor;
        // this.drawning = {fileHandle: undefined};
        this.init();
    }
    init() {
        this.drawGrid();
    }
    // private drawPixel(x: number, y: number, color = 10, isHistoryEvent = false) {
    //   const pixelXstart = x - (x % this.pixelSize);
    //   const pixelYstart = y - (y % this.pixelSize);
    //   if(pixelXstart === this.lastDrawnPixel.x && pixelYstart === this.lastDrawnPixel.y && color === this.lastDrawnPixel.color) {
    //     return;
    //   }
    //   this.lastDrawnPixel.x = pixelXstart;
    //   this.lastDrawnPixel.y = pixelYstart;
    //   this.lastDrawnPixel.color = color;
    //   if (!isHistoryEvent) {
    //     historyHandler.push({x: pixelXstart, y: pixelYstart, color});
    //   }
    //   this.ctx.fillStyle = color;
    //   this.ctx.fillRect(pixelXstart, pixelYstart, this.pixelSize, this.pixelSize);
    //   // this.ctx.fillText(`${pixelXstart}, ${pixelYstart}`, pixelXstart, pixelYstart, 800);
    // }
    drawGrid() {
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
}
export const canvasHandler = new CanvasHandler();
