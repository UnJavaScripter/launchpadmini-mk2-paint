class CanvasController {
    // drawning: Drawning;
    constructor(pixelSize = 50) {
        this.controlColumnColors = ["#e4585d", "#e22323", "#e46c58", "#ff8b5e", "#e0a448", "#d4b336", "#e8dd51", "#5bdc60"];
        this._canvasElem = document.getElementById('canvas');
        this.ctx = this.canvasElem.getContext('2d');
        this.canvasBCR = this._canvasElem.getBoundingClientRect();
        this.pixelSize = {
            x: this.canvasElem.width / 9,
            y: this.canvasElem.height / 8,
        };
        console.log(this.pixelSize);
        this.canvasElem.style.width = '100%';
        this.canvasElem.style.height = '100%';
        this.lastDrawnPixel = {};
        // this.selectedColor = colorPicker.selectedColor;
        // this.drawning = {fileHandle: undefined};
    }
    get canvasElem() {
        return this._canvasElem;
    }
    init() {
        this.drawGrid();
        // this.ranDraw(20)
    }
    drawPixel(x, y, color = 'rebeccapurple', isHistoryEvent = false) {
        console.log(x, y);
        // const pixelXstart = x * this.pixelSize.x;
        // const pixelYstart = y * this.pixelSize.y;
        const pixelXstart = x - (x % this.pixelSize.x);
        const pixelYstart = y - (y % this.pixelSize.y);
        // console.log(`coords ${x},${y}`);
        // console.log(`converter cooords ${pixelXstart}, ${pixelYstart}`)
        // if(pixelXstart === this.lastDrawnPixel.x && pixelYstart === this.lastDrawnPixel.y && color === this.lastDrawnPixel.color) {
        //   return;
        // }
        this.lastDrawnPixel.x = pixelXstart;
        this.lastDrawnPixel.y = pixelYstart;
        this.lastDrawnPixel.color = color;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(pixelXstart, pixelYstart, this.pixelSize.x, this.pixelSize.y);
        // this.ctx.fillText(`${pixelXstart}, ${pixelYstart}`, pixelXstart, pixelYstart, 800);
    }
    drawGrid() {
        this.ctx.fillStyle = '#666';
        this.ctx.strokeStyle = '#0ff';
        this.ctx.fillRect(0, 0, this.canvasElem.width, this.canvasElem.height);
        this.ctx.strokeRect(0, 0, this.canvasElem.width, this.canvasElem.height);
        this.ctx.strokeStyle = '#777';
        this.ctx.beginPath();
        for (let i = 0; i <= this.canvasElem.width; i += this.pixelSize.x) {
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvasElem.height);
        }
        for (let i = 0; i <= this.canvasElem.height; i += this.pixelSize.y) {
            // Control column      
            const rowNumber = Math.floor(i / this.pixelSize.y);
            this.ctx.fillStyle = this.controlColumnColors[rowNumber];
            this.ctx.fillRect(this.canvasElem.width - this.pixelSize.x, i, this.pixelSize.x, this.pixelSize.y);
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
    reDraw(pixels) {
        console.log(pixels);
        const raf = requestAnimationFrame(() => {
            this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
            this.drawGrid();
            //   this.reDrawPixelsFromHistory(pixels);
            cancelAnimationFrame(raf);
        });
    }
}
export const canvasController = new CanvasController();
