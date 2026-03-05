import { Buffer } from "./buffer.js";
import { readUInt8 } from "./integers.js";

export function addBool<B extends Buffer>(buf: B, b: boolean): B {
  buf.addOne(b ? 1 : 0);
  return buf;
}

export function readBool(buf: Buffer): boolean {
  return readUInt8(buf) === 1;
}
