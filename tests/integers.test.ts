import { Buffer } from "../src/buffer.js";
import {
  addUInt8, readUInt8, addInt8, readInt8,
  addUInt16, readUInt16, addInt16, readInt16,
  addUInt32, readUInt32, addInt32, readInt32,
  addUInt64, readUInt64, addInt64, readInt64,
} from "../src/integers.js";

describe("Standalone integers", () => {
  describe("8-bit", () => {
    it("should add and read uint8", () => {
      const buf = Buffer.alloc(64);
      addUInt8(buf, 255);
      buf.seek(0);
      expect(readUInt8(buf)).toBe(255);
    });

    it("should add and read int8", () => {
      const buf = Buffer.alloc(64);
      addInt8(buf, -120);
      buf.seek(0);
      expect(readInt8(buf)).toBe(-120);
    });
  });

  describe("16-bit", () => {
    it("should add and read uint16", () => {
      const buf = Buffer.alloc(64);
      addUInt16(buf, 65535);
      buf.seek(0);
      expect(readUInt16(buf)).toBe(65535);
    });

    it("should add and read int16", () => {
      const buf = Buffer.alloc(64);
      addInt16(buf, -32768);
      buf.seek(0);
      expect(readInt16(buf)).toBe(-32768);
    });
  });

  describe("32-bit", () => {
    it("should add and read uint32", () => {
      const buf = Buffer.alloc(64);
      addUInt32(buf, 4294967295);
      buf.seek(0);
      expect(readUInt32(buf)).toBe(4294967295);
    });

    it("should add and read int32", () => {
      const buf = Buffer.alloc(64);
      addInt32(buf, -2147483648);
      buf.seek(0);
      expect(readInt32(buf)).toBe(-2147483648);
    });
  });

  describe("64-bit", () => {
    it("should add and read uint64", () => {
      const buf = Buffer.alloc(64);
      addUInt64(buf, Number.MAX_SAFE_INTEGER);
      buf.seek(0);
      expect(readUInt64(buf)).toBe(Number.MAX_SAFE_INTEGER);
    });

    it("should add and read int64", () => {
      const buf = Buffer.alloc(64);
      addInt64(buf, Number.MIN_SAFE_INTEGER);
      buf.seek(0);
      expect(readInt64(buf)).toBe(Number.MIN_SAFE_INTEGER);
    });
  });

  describe("error handling", () => {
    it("should throw on uint8 with insufficient data", () => {
      const buf = Buffer.alloc(1);
      buf.seek(1);
      expect(() => readUInt8(buf)).toThrow("Not enough data to read uint8");
    });

    it("should throw on int8 with insufficient data", () => {
      const buf = Buffer.alloc(1);
      buf.seek(1);
      expect(() => readInt8(buf)).toThrow("Not enough data to read int8");
    });

    it("should throw on uint16 with insufficient data", () => {
      const buf = Buffer.alloc(1);
      expect(() => readUInt16(buf)).toThrow("Not enough data to read uint16");
    });

    it("should throw on int16 with insufficient data", () => {
      const buf = Buffer.alloc(1);
      expect(() => readInt16(buf)).toThrow("Not enough data to read int16");
    });

    it("should throw on uint32 with insufficient data", () => {
      const buf = Buffer.alloc(3);
      expect(() => readUInt32(buf)).toThrow("Not enough data to read uint32");
    });

    it("should throw on int32 with insufficient data", () => {
      const buf = Buffer.alloc(3);
      expect(() => readInt32(buf)).toThrow("Not enough data to read int32");
    });

    it("should throw on uint64 with insufficient data", () => {
      const buf = Buffer.alloc(7);
      expect(() => readUInt64(buf)).toThrow("Not enough data to read uint64");
    });

    it("should throw on int64 with insufficient data", () => {
      const buf = Buffer.alloc(7);
      expect(() => readInt64(buf)).toThrow("Not enough data to read int64");
    });
  });
});
