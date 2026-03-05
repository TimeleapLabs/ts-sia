export const GLOBAL_SHARED_UNSAFE_BUFFER = {
  buffer: new Uint8Array(32 * 1024 * 1024),
  offset: 0,
};

export class Buffer {
  public size: number;
  public content: Uint8Array;
  public offset: number;
  public dataView: DataView;

  constructor(uint8Array: Uint8Array) {
    this.size = uint8Array.length;
    this.content = uint8Array;
    this.offset = 0;
    this.dataView = new DataView(
      uint8Array.buffer,
      uint8Array.byteOffset,
      uint8Array.byteLength,
    );
  }

  static alloc(size: number): Buffer {
    return new Buffer(new Uint8Array(size));
  }

  static allocUnsafe(size: number): Buffer {
    const begin =
      GLOBAL_SHARED_UNSAFE_BUFFER.offset + size >
      GLOBAL_SHARED_UNSAFE_BUFFER.buffer.length
        ? 0
        : GLOBAL_SHARED_UNSAFE_BUFFER.offset;

    const subarray = GLOBAL_SHARED_UNSAFE_BUFFER.buffer.subarray(
      begin,
      begin + size,
    );

    GLOBAL_SHARED_UNSAFE_BUFFER.offset = begin + size;
    return new Buffer(subarray);
  }

  seek(offset: number): this {
    this.offset = offset;
    return this;
  }

  skip(count: number): this {
    this.offset += count;
    return this;
  }

  setContent(uint8Array: Uint8Array): this {
    this.size = uint8Array.length;
    this.content = uint8Array;
    this.offset = 0;
    this.dataView = new DataView(
      uint8Array.buffer,
      uint8Array.byteOffset,
      uint8Array.byteLength,
    );
    return this;
  }

  add(data: Uint8Array) {
    if (this.offset + data.length > this.size) {
      throw new Error("Buffer overflow");
    }
    this.content.set(data, this.offset);
    this.offset += data.length;
  }

  addOne(data: number) {
    if (this.offset + 1 > this.size) {
      throw new Error("Buffer overflow");
    }
    this.content[this.offset] = data;
    this.offset++;
  }

  toUint8Array() {
    return this.content.slice(0, this.offset);
  }

  toUint8ArrayReference() {
    return this.content.subarray(0, this.offset);
  }

  slice(start: number, end: number) {
    return this.content.slice(start, end);
  }

  get(offset: number) {
    return this.content[offset];
  }

  get length() {
    return this.size;
  }
}
