import { Sia } from "../src/index.js";

describe("Sia - Integer (Signed & Unsigned)", () => {
  describe("8-bit", () => {
    it("should correctly add and read a uint8 value", () => {
      const sia = new Sia();
      sia.addUInt8(255);
      sia.seek(0);
      expect(sia.readUInt8()).toBe(255);
    });

    it("should correctly add and read an int8 value", () => {
      const sia = new Sia();
      sia.addInt8(-120);
      sia.seek(0);
      expect(sia.readInt8()).toBe(-120);
    });

    it("should truncate values outside the int8 range (-128 to 127)", () => {
      const sia = new Sia();
      sia.addInt8(-129);
      sia.seek(0);
      expect(sia.readInt8()).toBe(127);
    });
  });

  describe("16-bit", () => {
    it("should correctly add and read a uint16 value", () => {
      const sia = new Sia();
      sia.addUInt16(65535);
      sia.seek(0);
      expect(sia.readUInt16()).toBe(65535);
    });

    it("should correctly add and read an int16 value", () => {
      const sia = new Sia();
      sia.addInt16(-32768);
      sia.seek(0);
      expect(sia.readInt16()).toBe(-32768);
    });
  });

  describe("32-bit", () => {
    it("should correctly add and read a uint32 value", () => {
      const sia = new Sia();
      sia.addUInt32(4294967295);
      sia.seek(0);
      expect(sia.readUInt32()).toBe(4294967295);
    });

    it("should correctly add and read an int32 value", () => {
      const sia = new Sia();
      sia.addInt32(-2147483648);
      sia.seek(0);
      expect(sia.readInt32()).toBe(-2147483648);
    });
  });

  describe("64-bit", () => {
    it("should correctly add and read a uint64 value", () => {
      const sia = new Sia();
      const value = Number.MAX_SAFE_INTEGER; // 2^53 - 1
      sia.addUInt64(value);
      sia.seek(0);
      expect(sia.readUInt64()).toBe(value);
    });

    it("should correctly add and read an int64 value", () => {
      const sia = new Sia();
      const value = Number.MIN_SAFE_INTEGER; // -(2^53 - 1)
      sia.addInt64(value);
      sia.seek(0);
      expect(sia.readInt64()).toBe(value);
    });
  });
});

describe("Sia - Boolean", () => {
  it("should correctly add and read a true boolean value", () => {
    const sia = new Sia();
    sia.addBool(true);
    sia.seek(0);
    expect(sia.readBool()).toBe(true);
  });

  it("should correctly add and read a false boolean value", () => {
    const sia = new Sia();
    sia.addBool(false);
    sia.seek(0);
    expect(sia.readBool()).toBe(false);
  });
});

describe("Sia - UTFZ String", () => {
  it("should correctly add and read a UTFZ string", () => {
    const sia = new Sia();
    const testString = "Hello, UTFZ!";
    sia.addUtfz(testString);
    sia.seek(0);
    expect(sia.readUtfz()).toBe(testString);
  });
});

describe("Sia - ASCII String", () => {
  it("should correctly add and read an ASCII string", () => {
    const sia = new Sia();
    const testString = "Hello, ASCII!";
    sia.addAscii(testString);
    sia.seek(0);
    expect(sia.readAscii()).toBe(testString);
  });
});

describe("Sia - String", () => {
  it("should correctly add and read a String8 value", () => {
    const sia = new Sia();
    const testString = "Hello, String8!";
    sia.addString8(testString);
    sia.seek(0);
    expect(sia.readString8()).toBe(testString);
  });
  it("should correctly add and read a String16 value", () => {
    const sia = new Sia();
    const testString = "Hello, String16!";
    sia.addString16(testString);
    sia.seek(0);
    expect(sia.readString16()).toBe(testString);
  });
  it("should correctly add and read a String32 value", () => {
    const sia = new Sia();
    const testString = "Hello, String32!";
    sia.addString32(testString);
    sia.seek(0);
    expect(sia.readString32()).toBe(testString);
  });
  it("should correctly add and read a String64 value", () => {
    const sia = new Sia();
    const testString = "Hello, String64!";
    sia.addString64(testString);
    sia.seek(0);
    expect(sia.readString64()).toBe(testString);
  });
});

describe("Sia - BigInt", () => {
  it("should correctly add and read a BigInt value", () => {
    const sia = new Sia();
    const bigIntValue = BigInt("123456789012345678901234567890");
    sia.addBigInt(bigIntValue);
    sia.seek(0);
    expect(sia.readBigInt()).toBe(bigIntValue);
  });

  it("should throw an error when adding a BigInt larger than 255 bytes", () => {
    const sia = new Sia();
    const largeBigInt = BigInt("0x" + "ff".repeat(256));
    expect(() => sia.addBigInt(largeBigInt)).toThrow(
      "BigInt too large for this simple implementation",
    );
  });
});

describe("Sia - ByteArray", () => {
  it("should correctly add and read a ByteArray8 value", () => {
    const sia = new Sia();
    const byteArray = new Uint8Array([1, 2, 3, 4, 5]);
    sia.addByteArray8(byteArray);
    sia.seek(0);
    const result = sia.readByteArray8();
    expect(result).toEqual(byteArray);
  });

  it("should correctly add and read a ByteArray16 value", () => {
    const sia = new Sia();
    const byteArray = new Uint8Array([10, 20, 30, 40, 50]);
    sia.addByteArray16(byteArray);
    sia.seek(0);
    const result = sia.readByteArray16();
    expect(result).toEqual(byteArray);
  });

  it("should correctly add and read a ByteArray32 value", () => {
    const sia = new Sia();
    const byteArray = new Uint8Array(100).map((_, i) => i);
    sia.addByteArray32(byteArray);
    sia.seek(0);
    const result = sia.readByteArray32();
    expect(result).toEqual(byteArray);
  });

  it("should correctly add and read a ByteArray64 value", () => {
    const sia = new Sia();
    const byteArray = new Uint8Array(50).map((_, i) => (i * 2) % 256);
    sia.addByteArray64(byteArray);
    sia.seek(0);
    const result = sia.readByteArray64();
    expect(result).toEqual(byteArray);
  });
});

describe("Sia - Array tests", () => {
  const writeNumber = (sia: Sia, n: number) => sia.addUInt8(n);
  const readNumber = (sia: Sia): number => sia.readUInt8();

  it("should correctly add and read array with addArray8/readArray8", () => {
    const sia = new Sia();
    const arr = [1, 2, 3, 255];
    sia.addArray8(arr, writeNumber);
    sia.seek(0);
    const result = sia.readArray8(readNumber);
    expect(result).toEqual(arr);
  });

  it("should correctly add and read array with addArray16/readArray16", () => {
    const sia = new Sia();
    const arr = [1000, 2000, 3000, 65535];
    const writeNum16 = (sia: Sia, n: number) => sia.addUInt16(n);
    const readNum16 = (sia: Sia) => sia.readUInt16();

    sia.addArray16(arr, writeNum16);
    sia.seek(0);
    const result = sia.readArray16(readNum16);
    expect(result).toEqual(arr);
  });

  it("should correctly add and read array with addArray32/readArray32", () => {
    const sia = new Sia();
    const arr = [100000, 200000, 300000, 4294967295];
    const writeNum32 = (sia: Sia, n: number) => sia.addUInt32(n);
    const readNum32 = (sia: Sia) => sia.readUInt32();

    sia.addArray32(arr, writeNum32);
    sia.seek(0);
    const result = sia.readArray32(readNum32);
    expect(result).toEqual(arr);
  });

  it("should correctly add and read array with addArray64/readArray64", () => {
    const sia = new Sia();
    const arr = [9007199254740991, 1234567890123456];
    const writeNum64 = (sia: Sia, n: number) => sia.addUInt64(n);
    const readNum64 = (sia: Sia) => sia.readUInt64();

    sia.addArray64(arr, writeNum64);
    sia.seek(0);
    const result = sia.readArray64(readNum64);
    expect(result).toEqual(arr);
  });
});

describe("Sia read methods - insufficient data error tests", () => {
  it("should throw an error when reading int8 with insufficient data", () => {
    const smallBuffer = new Uint8Array(1);
    const sia = new Sia(smallBuffer);
    sia.seek(1); // Move offset to the end
    expect(() => sia.readInt8()).toThrow("Not enough data to read int8");
  });

  it("should throw an error when reading uint8 with insufficient data", () => {
    const smallBuffer = new Uint8Array(1);
    const sia = new Sia(smallBuffer);
    sia.seek(1); // Move offset to the end
    expect(() => sia.readUInt8()).toThrow("Not enough data to read uint8");
  });

  it("should throw an error when reading uint16 with insufficient data", () => {
    const smallBuffer = new Uint8Array(1); // less than 2 bytes needed
    const sia = new Sia(smallBuffer);
    sia.seek(0);
    expect(() => sia.readUInt16()).toThrow("Not enough data to read uint16");
  });

  it("should throw an error when reading int16 with insufficient data", () => {
    const smallBuffer = new Uint8Array(1);
    const sia = new Sia(smallBuffer);
    sia.seek(0);
    expect(() => sia.readInt16()).toThrow("Not enough data to read int16");
  });

  it("should throw an error when reading uint32 with insufficient data", () => {
    const smallBuffer = new Uint8Array(3); // less than 4 bytes
    const sia = new Sia(smallBuffer);
    sia.seek(0);
    expect(() => sia.readUInt32()).toThrow("Not enough data to read uint32");
  });

  it("should throw an error when reading int32 with insufficient data", () => {
    const smallBuffer = new Uint8Array(3);
    const sia = new Sia(smallBuffer);
    sia.seek(0);
    expect(() => sia.readInt32()).toThrow("Not enough data to read int32");
  });

  it("should throw an error when reading uint64 with insufficient data", () => {
    const smallBuffer = new Uint8Array(7); // less than 8 bytes
    const sia = new Sia(smallBuffer);
    sia.seek(0);
    expect(() => sia.readUInt64()).toThrow("Not enough data to read uint64");
  });

  it("should throw an error when reading int64 with insufficient data", () => {
    const smallBuffer = new Uint8Array(7);
    const sia = new Sia(smallBuffer);
    sia.seek(0);
    expect(() => sia.readInt64()).toThrow("Not enough data to read int64");
  });

  it("should throw an error when reading byte array with insufficient data", () => {
    const smallBuffer = new Uint8Array(3);
    const sia = new Sia(smallBuffer);
    sia.seek(0);
    expect(() => sia.readByteArrayN(4)).toThrow(
      "Not enough data to read byte array",
    );
  });
});
