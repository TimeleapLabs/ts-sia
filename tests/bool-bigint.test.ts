import { Buffer } from "../src/buffer.js";
import { addBool, readBool } from "../src/bool.js";
import { addBigInt, readBigInt } from "../src/bigint.js";

describe("Standalone bool", () => {
  it("should add and read true", () => {
    const buf = Buffer.alloc(64);
    addBool(buf, true);
    buf.seek(0);
    expect(readBool(buf)).toBe(true);
  });

  it("should add and read false", () => {
    const buf = Buffer.alloc(64);
    addBool(buf, false);
    buf.seek(0);
    expect(readBool(buf)).toBe(false);
  });
});

describe("Standalone bigint", () => {
  it("should add and read a BigInt value", () => {
    const buf = Buffer.alloc(256);
    const val = BigInt("123456789012345678901234567890");
    addBigInt(buf, val);
    buf.seek(0);
    expect(readBigInt(buf)).toBe(val);
  });

  it("should throw for BigInt larger than 255 bytes", () => {
    const buf = Buffer.alloc(512);
    const large = BigInt("0x" + "ff".repeat(256));
    expect(() => addBigInt(buf, large)).toThrow("BigInt too large for this simple implementation");
  });
});
