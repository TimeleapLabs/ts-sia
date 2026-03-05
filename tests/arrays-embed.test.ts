import { Buffer } from "../src/buffer.js";
import { addUInt8, readUInt8, addUInt16, readUInt16, addUInt32, readUInt32, addUInt64, readUInt64 } from "../src/integers.js";
import { addArray8, readArray8, addArray16, readArray16, addArray32, readArray32, addArray64, readArray64 } from "../src/arrays.js";
import { embedSia, embedBytes } from "../src/embed.js";

describe("Standalone arrays", () => {
  it("should add and read array8", () => {
    const buf = Buffer.alloc(256);
    addArray8(buf, [1, 2, 3, 255], (b, n) => addUInt8(b, n));
    buf.seek(0);
    expect(readArray8(buf, (b) => readUInt8(b))).toEqual([1, 2, 3, 255]);
  });

  it("should add and read array16", () => {
    const buf = Buffer.alloc(256);
    addArray16(buf, [1000, 2000, 3000, 65535], (b, n) => addUInt16(b, n));
    buf.seek(0);
    expect(readArray16(buf, (b) => readUInt16(b))).toEqual([1000, 2000, 3000, 65535]);
  });

  it("should add and read array32", () => {
    const buf = Buffer.alloc(256);
    addArray32(buf, [100000, 200000, 4294967295], (b, n) => addUInt32(b, n));
    buf.seek(0);
    expect(readArray32(buf, (b) => readUInt32(b))).toEqual([100000, 200000, 4294967295]);
  });

  it("should add and read array64", () => {
    const buf = Buffer.alloc(256);
    addArray64(buf, [9007199254740991, 1234567890123456], (b, n) => addUInt64(b, n));
    buf.seek(0);
    expect(readArray64(buf, (b) => readUInt64(b))).toEqual([9007199254740991, 1234567890123456]);
  });
});

describe("Standalone embed", () => {
  it("should embed another buffer's content", () => {
    const buf1 = Buffer.alloc(64);
    const buf2 = Buffer.alloc(64);
    addUInt8(buf2, 42);
    addUInt8(buf2, 99);
    embedSia(buf1, buf2);
    buf1.seek(0);
    expect(readUInt8(buf1)).toBe(42);
    expect(readUInt8(buf1)).toBe(99);
  });

  it("should embed raw bytes", () => {
    const buf = Buffer.alloc(64);
    embedBytes(buf, new Uint8Array([1, 2, 3]));
    buf.seek(0);
    expect(readUInt8(buf)).toBe(1);
    expect(readUInt8(buf)).toBe(2);
    expect(readUInt8(buf)).toBe(3);
  });
});
