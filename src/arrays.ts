import { Buffer } from "./buffer.js";
import { addUInt8, readUInt8, addUInt16, readUInt16, addUInt32, readUInt32, addUInt64, readUInt64 } from "./integers.js";

function readArray<T>(buf: Buffer, length: number, fn: (b: Buffer) => T): T[] {
  const array = new Array(length);
  for (let i = 0; i < length; i++) {
    array[i] = fn(buf);
  }
  return array;
}

export function addArray8<B extends Buffer, T>(buf: B, arr: T[], fn: (b: B, item: T) => void): B {
  addUInt8(buf, arr.length);
  arr.forEach((item) => fn(buf, item));
  return buf;
}

export function readArray8<T>(buf: Buffer, fn: (b: Buffer) => T): T[] {
  const length = readUInt8(buf);
  return readArray(buf, length, fn);
}

export function addArray16<B extends Buffer, T>(buf: B, arr: T[], fn: (b: B, item: T) => void): B {
  addUInt16(buf, arr.length);
  arr.forEach((item) => fn(buf, item));
  return buf;
}

export function readArray16<T>(buf: Buffer, fn: (b: Buffer) => T): T[] {
  const length = readUInt16(buf);
  return readArray(buf, length, fn);
}

export function addArray32<B extends Buffer, T>(buf: B, arr: T[], fn: (b: B, item: T) => void): B {
  addUInt32(buf, arr.length);
  arr.forEach((item) => fn(buf, item));
  return buf;
}

export function readArray32<T>(buf: Buffer, fn: (b: Buffer) => T): T[] {
  const length = readUInt32(buf);
  return readArray(buf, length, fn);
}

export function addArray64<B extends Buffer, T>(buf: B, arr: T[], fn: (b: B, item: T) => void): B {
  addUInt64(buf, arr.length);
  arr.forEach((item) => fn(buf, item));
  return buf;
}

export function readArray64<T>(buf: Buffer, fn: (b: Buffer) => T): T[] {
  const length = readUInt64(buf);
  return readArray(buf, length, fn);
}
