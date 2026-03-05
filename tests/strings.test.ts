import { Buffer } from "../src/buffer.js";
import {
  addUtfz, readUtfz,
  addAsciiN, readAsciiN, addAscii8, readAscii8,
  addAscii16, readAscii16, addAscii32, readAscii32, addAscii64, readAscii64,
  addString8, readString8, addString16, readString16,
  addString32, readString32, addString64, readString64,
} from "../src/strings.js";

describe("Standalone strings", () => {
  describe("UTFZ", () => {
    it("should add and read UTFZ string", () => {
      const buf = Buffer.alloc(256);
      addUtfz(buf, "Hello, UTFZ!");
      buf.seek(0);
      expect(readUtfz(buf)).toBe("Hello, UTFZ!");
    });
  });

  describe("ASCII", () => {
    const testString = "Hello, ASCII!";

    it("should add and read AsciiN", () => {
      const buf = Buffer.alloc(256);
      addAsciiN(buf, testString);
      buf.seek(0);
      expect(readAsciiN(buf, testString.length)).toBe(testString);
    });

    it("should add and read Ascii8", () => {
      const buf = Buffer.alloc(256);
      addAscii8(buf, testString);
      buf.seek(0);
      expect(readAscii8(buf)).toBe(testString);
    });

    it("should add and read Ascii16", () => {
      const buf = Buffer.alloc(256);
      addAscii16(buf, testString);
      buf.seek(0);
      expect(readAscii16(buf)).toBe(testString);
    });

    it("should add and read Ascii32", () => {
      const buf = Buffer.alloc(256);
      addAscii32(buf, testString);
      buf.seek(0);
      expect(readAscii32(buf)).toBe(testString);
    });

    it("should add and read Ascii64", () => {
      const buf = Buffer.alloc(256);
      addAscii64(buf, testString);
      buf.seek(0);
      expect(readAscii64(buf)).toBe(testString);
    });
  });

  describe("UTF-8 String", () => {
    it("should add and read String8", () => {
      const buf = Buffer.alloc(256);
      addString8(buf, "Hello, String8!");
      buf.seek(0);
      expect(readString8(buf)).toBe("Hello, String8!");
    });

    it("should add and read String16", () => {
      const buf = Buffer.alloc(256);
      addString16(buf, "Hello, String16!");
      buf.seek(0);
      expect(readString16(buf)).toBe("Hello, String16!");
    });

    it("should add and read String32", () => {
      const buf = Buffer.alloc(256);
      addString32(buf, "Hello, String32!");
      buf.seek(0);
      expect(readString32(buf)).toBe("Hello, String32!");
    });

    it("should add and read String64", () => {
      const buf = Buffer.alloc(256);
      addString64(buf, "Hello, String64!");
      buf.seek(0);
      expect(readString64(buf)).toBe("Hello, String64!");
    });
  });
});
