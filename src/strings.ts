import { Buffer } from "./buffer.js";
import { pack, unpack } from "utfz-lib";
import { asciiToUint8Array, uint8ArrayToAscii } from "./ascii.js";
import { addUInt8, readUInt8, addUInt16, readUInt16, addUInt32, readUInt32, addUInt64, readUInt64 } from "./integers.js";
import { addByteArray8, readByteArray8, addByteArray16, readByteArray16, addByteArray32, readByteArray32, addByteArray64, readByteArray64 } from "./byteArrays.js";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function addUtfz<B extends Buffer>(buf: B, str: string): B {
  const lengthOffset = buf.offset++;
  const length = pack(str, str.length, buf.content, buf.offset);
  buf.content[lengthOffset] = length;
  buf.offset += length;
  return buf;
}

export function readUtfz(buf: Buffer): string {
  const length = readUInt8(buf);
  const str = unpack(buf.content, length, buf.offset);
  buf.offset += length;
  return str;
}

export function addAsciiN<B extends Buffer>(buf: B, str: string): B {
  buf.offset += asciiToUint8Array(str, str.length, buf.content, buf.offset);
  return buf;
}

export function readAsciiN(buf: Buffer, length: number): string {
  const str = uint8ArrayToAscii(buf.content, length, buf.offset);
  buf.offset += length;
  return str;
}

export function addAscii8<B extends Buffer>(buf: B, str: string): B {
  const length = str.length;
  addUInt8(buf, length);
  buf.offset += asciiToUint8Array(str, length, buf.content, buf.offset);
  return buf;
}

export function readAscii8(buf: Buffer): string {
  const length = readUInt8(buf);
  const str = uint8ArrayToAscii(buf.content, length, buf.offset);
  buf.offset += length;
  return str;
}

export function addAscii16<B extends Buffer>(buf: B, str: string): B {
  const length = str.length;
  addUInt16(buf, length);
  buf.offset += asciiToUint8Array(str, length, buf.content, buf.offset);
  return buf;
}

export function readAscii16(buf: Buffer): string {
  const length = readUInt16(buf);
  const str = uint8ArrayToAscii(buf.content, length, buf.offset);
  buf.offset += length;
  return str;
}

export function addAscii32<B extends Buffer>(buf: B, str: string): B {
  const length = str.length;
  addUInt32(buf, length);
  buf.offset += asciiToUint8Array(str, length, buf.content, buf.offset);
  return buf;
}

export function readAscii32(buf: Buffer): string {
  const length = readUInt32(buf);
  const str = uint8ArrayToAscii(buf.content, length, buf.offset);
  buf.offset += length;
  return str;
}

export function addAscii64<B extends Buffer>(buf: B, str: string): B {
  const length = str.length;
  addUInt64(buf, length);
  buf.offset += asciiToUint8Array(str, length, buf.content, buf.offset);
  return buf;
}

export function readAscii64(buf: Buffer): string {
  const length = readUInt64(buf);
  const str = uint8ArrayToAscii(buf.content, length, buf.offset);
  buf.offset += length;
  return str;
}

export function addString8<B extends Buffer>(buf: B, str: string): B {
  const encoded = encoder.encode(str);
  return addByteArray8(buf, encoded);
}

export function readString8(buf: Buffer): string {
  const bytes = readByteArray8(buf, true);
  return decoder.decode(bytes);
}

export function addString16<B extends Buffer>(buf: B, str: string): B {
  const encoded = encoder.encode(str);
  return addByteArray16(buf, encoded);
}

export function readString16(buf: Buffer): string {
  const bytes = readByteArray16(buf, true);
  return decoder.decode(bytes);
}

export function addString32<B extends Buffer>(buf: B, str: string): B {
  const encoded = encoder.encode(str);
  return addByteArray32(buf, encoded);
}

export function readString32(buf: Buffer): string {
  const bytes = readByteArray32(buf, true);
  return decoder.decode(bytes);
}

export function addString64<B extends Buffer>(buf: B, str: string): B {
  const encoded = encoder.encode(str);
  return addByteArray64(buf, encoded);
}

export function readString64(buf: Buffer): string {
  const bytes = readByteArray64(buf, true);
  return decoder.decode(bytes);
}
