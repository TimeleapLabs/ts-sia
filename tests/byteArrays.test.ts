import { Buffer } from "../src/buffer.js";
import {
  addByteArrayN, readByteArrayN,
  addByteArray8, readByteArray8,
  addByteArray16, readByteArray16,
  addByteArray32, readByteArray32,
  addByteArray64, readByteArray64,
} from "../src/byteArrays.js";

describe("Standalone byteArrays", () => {
  it("should add and read ByteArray8", () => {
    const buf = Buffer.alloc(256);
    const bytes = new Uint8Array([1, 2, 3, 4, 5]);
    addByteArray8(buf, bytes);
    buf.seek(0);
    expect(readByteArray8(buf)).toEqual(bytes);
  });

  it("should add and read ByteArray16", () => {
    const buf = Buffer.alloc(256);
    const bytes = new Uint8Array([10, 20, 30, 40, 50]);
    addByteArray16(buf, bytes);
    buf.seek(0);
    expect(readByteArray16(buf)).toEqual(bytes);
  });

  it("should add and read ByteArray32", () => {
    const buf = Buffer.alloc(256);
    const bytes = new Uint8Array(100).map((_, i) => i);
    addByteArray32(buf, bytes);
    buf.seek(0);
    expect(readByteArray32(buf)).toEqual(bytes);
  });

  it("should add and read ByteArray64", () => {
    const buf = Buffer.alloc(256);
    const bytes = new Uint8Array(50).map((_, i) => (i * 2) % 256);
    addByteArray64(buf, bytes);
    buf.seek(0);
    expect(readByteArray64(buf)).toEqual(bytes);
  });

  it("should throw on insufficient data", () => {
    const buf = Buffer.alloc(3);
    expect(() => readByteArrayN(buf, 4)).toThrow("Not enough data to read byte array");
  });
});
