var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class SerialController {
    constructor() {
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
    }
    init(startConnectionElement) {
        startConnectionElement.addEventListener('pointerdown', (event) => {
            this.connect();
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if ('serial' in navigator) {
                this.port = yield navigator.serial.requestPort();
                yield this.port.open({ baudrate: 9600 });
                this.reader = this.port.readable.getReader();
                this.writer = this.port.writable.getWriter();
            }
            else {
                console.error('Web serial doesn\'t seem to be enabled in your browser. Try enabling it (if Chrome, visit chrome://flags/#enable-experimental-web-platform-features).');
            }
        });
    }
    isConnected() {
        return !!this.port;
    }
    write(data) {
        if (this.port) {
            const dataArrayBuffer = this.encoder.encode(data);
            this.writer.write(dataArrayBuffer);
        }
        else {
            console.error('conect to a serial port first.');
        }
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const readerData = yield this.reader.read();
                return this.decoder.decode(readerData.value);
            }
            catch (err) {
                const errorMessage = `error reading data: ${err}`;
                console.error(errorMessage);
                return errorMessage;
            }
        });
    }
    clear() {
        if (!this.isConnected()) {
            return;
        }
        this.write('cls');
    }
}
export const serialController = new SerialController();
