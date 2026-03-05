import { Buffer, getSharedBuffer, GLOBAL_SHARED_UNSAFE_BUFFER } from "./buffer.js";
import {
  addUInt8, readUInt8, addInt8, readInt8,
  addUInt16, readUInt16, addInt16, readInt16,
  addUInt32, readUInt32, addInt32, readInt32,
  addUInt64, readUInt64, addInt64, readInt64,
} from "./integers.js";
import {
  addUtfz, readUtfz,
  addAsciiN, readAsciiN, addAscii8, readAscii8,
  addAscii16, readAscii16, addAscii32, readAscii32,
  addAscii64, readAscii64,
  addString8, readString8, addString16, readString16,
  addString32, readString32, addString64, readString64,
} from "./strings.js";
import {
  addByteArrayN, readByteArrayN,
  addByteArray8, readByteArray8,
  addByteArray16, readByteArray16,
  addByteArray32, readByteArray32,
  addByteArray64, readByteArray64,
} from "./byteArrays.js";
import { addBool, readBool } from "./bool.js";
import { addBigInt, readBigInt } from "./bigint.js";
import {
  addArray8, readArray8, addArray16, readArray16,
  addArray32, readArray32, addArray64, readArray64,
} from "./arrays.js";
import { embedSia as _embedSia, embedBytes as _embedBytes } from "./embed.js";

export class Sia extends Buffer {
  constructor(content?: Uint8Array) {
    super(content || getSharedBuffer());
  }

  static alloc(size: number): Sia {
    return new Sia(new Uint8Array(size));
  }

  static allocUnsafe(size: number): Sia {
    const shared = getSharedBuffer();
    const begin =
      GLOBAL_SHARED_UNSAFE_BUFFER.offset + size > shared.length
        ? 0
        : GLOBAL_SHARED_UNSAFE_BUFFER.offset;

    const subarray = shared.subarray(begin, begin + size);

    GLOBAL_SHARED_UNSAFE_BUFFER.offset = begin + size;
    return new Sia(subarray);
  }

  // Integers
  addUInt8(n: number): Sia { return addUInt8(this, n); }
  readUInt8(): number { return readUInt8(this); }
  addInt8(n: number): Sia { return addInt8(this, n); }
  readInt8(): number { return readInt8(this); }
  addUInt16(n: number): Sia { return addUInt16(this, n); }
  readUInt16(): number { return readUInt16(this); }
  addInt16(n: number): Sia { return addInt16(this, n); }
  readInt16(): number { return readInt16(this); }
  addUInt32(n: number): Sia { return addUInt32(this, n); }
  readUInt32(): number { return readUInt32(this); }
  addInt32(n: number): Sia { return addInt32(this, n); }
  readInt32(): number { return readInt32(this); }
  addUInt64(n: number): Sia { return addUInt64(this, n); }
  readUInt64(): number { return readUInt64(this); }
  addInt64(n: number): Sia { return addInt64(this, n); }
  readInt64(): number { return readInt64(this); }

  // Strings
  addUtfz(str: string): Sia { return addUtfz(this, str); }
  readUtfz(): string { return readUtfz(this); }
  addAsciiN(str: string): Sia { return addAsciiN(this, str); }
  readAsciiN(length: number): string { return readAsciiN(this, length); }
  addAscii8(str: string): Sia { return addAscii8(this, str); }
  readAscii8(): string { return readAscii8(this); }
  addAscii16(str: string): Sia { return addAscii16(this, str); }
  readAscii16(): string { return readAscii16(this); }
  addAscii32(str: string): Sia { return addAscii32(this, str); }
  readAscii32(): string { return readAscii32(this); }
  addAscii64(str: string): Sia { return addAscii64(this, str); }
  readAscii64(): string { return readAscii64(this); }
  addString8(str: string): Sia { return addString8(this, str); }
  readString8(): string { return readString8(this); }
  addString16(str: string): Sia { return addString16(this, str); }
  readString16(): string { return readString16(this); }
  addString32(str: string): Sia { return addString32(this, str); }
  readString32(): string { return readString32(this); }
  addString64(str: string): Sia { return addString64(this, str); }
  readString64(): string { return readString64(this); }

  // Byte arrays
  addByteArrayN(bytes: Uint8Array): Sia { return addByteArrayN(this, bytes); }
  readByteArrayN(length: number, asReference = false): Uint8Array { return readByteArrayN(this, length, asReference); }
  addByteArray8(bytes: Uint8Array): Sia { return addByteArray8(this, bytes); }
  readByteArray8(asReference = false): Uint8Array { return readByteArray8(this, asReference); }
  addByteArray16(bytes: Uint8Array): Sia { return addByteArray16(this, bytes); }
  readByteArray16(asReference = false): Uint8Array { return readByteArray16(this, asReference); }
  addByteArray32(bytes: Uint8Array): Sia { return addByteArray32(this, bytes); }
  readByteArray32(asReference = false): Uint8Array { return readByteArray32(this, asReference); }
  addByteArray64(bytes: Uint8Array): Sia { return addByteArray64(this, bytes); }
  readByteArray64(asReference = false): Uint8Array { return readByteArray64(this, asReference); }

  // Bool
  addBool(b: boolean): Sia { return addBool(this, b); }
  readBool(): boolean { return readBool(this); }

  // BigInt
  addBigInt(n: bigint): Sia { return addBigInt(this, n); }
  readBigInt(): bigint { return readBigInt(this); }

  // Arrays
  addArray8<T>(arr: T[], fn: (s: Sia, item: T) => void): Sia { return addArray8(this, arr, fn); }
  readArray8<T>(fn: (s: Sia) => T): T[] { return readArray8(this, fn as (b: Buffer) => T); }
  addArray16<T>(arr: T[], fn: (s: Sia, item: T) => void): Sia { return addArray16(this, arr, fn); }
  readArray16<T>(fn: (s: Sia) => T): T[] { return readArray16(this, fn as (b: Buffer) => T); }
  addArray32<T>(arr: T[], fn: (s: Sia, item: T) => void): Sia { return addArray32(this, arr, fn); }
  readArray32<T>(fn: (s: Sia) => T): T[] { return readArray32(this, fn as (b: Buffer) => T); }
  addArray64<T>(arr: T[], fn: (s: Sia, item: T) => void): Sia { return addArray64(this, arr, fn); }
  readArray64<T>(fn: (s: Sia) => T): T[] { return readArray64(this, fn as (b: Buffer) => T); }

  // Embed
  embedSia(sia: Sia): Sia { return _embedSia(this, sia); }
  embedBytes(bytes: Uint8Array): Sia { return _embedBytes(this, bytes); }
}
