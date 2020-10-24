class SerialController {
  port: any;
  reader: any;
  writer: any;
  encoder = new TextEncoder();
  decoder = new TextDecoder();

  constructor() { }

  init(startConnectionElement: HTMLElement) {
    startConnectionElement.addEventListener('pointerdown', (event: PointerEvent) => {
      this.connect();
    });
  }

  async connect() {
    if ('serial' in navigator) {
      this.port = await (navigator as any).serial.requestPort();
      await this.port.open({ baudrate: 9600 });
      this.reader = this.port.readable.getReader();
      this.writer = this.port.writable.getWriter();
    } else {
      console.error('Web serial doesn\'t seem to be enabled in your browser. Try enabling it (if Chrome, visit chrome://flags/#enable-experimental-web-platform-features).')
    }
  }

  isConnected(): boolean {
    return !!this.port;
  }

  write(data: string) {
    if(this.port) {
      const dataArrayBuffer = this.encoder.encode(data);
      this.writer.write(dataArrayBuffer);
    } else {
      console.error('conect to a serial port first.');
    }
  }

  async read(): Promise<string> {
    try {
      const readerData = await this.reader.read();
      return this.decoder.decode(readerData.value);
    } catch (err) {
      const errorMessage = `error reading data: ${err}`;
      console.error(errorMessage);
      return errorMessage;
    }
  }

  clear() {
    if(!this.isConnected()) {
      return;
    }
    this.write('cls');
  }
}

export const serialController = new SerialController();