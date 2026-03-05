import { Buffer } from "./buffer.js";
import { addUInt8, readUInt8, addUInt16, readUInt16, addUInt32, readUInt32, addUInt64, readUInt64 } from "./integers.js";

export function addByteArrayN<B extends Buffer>(buf: B, bytes: Uint8Array): B {
  buf.add(bytes);
  return buf;
}

export function readByteArrayN(buf: Buffer, length: number, asReference = false): Uint8Array {
  if (buf.offset + length > buf.content.length) {
    throw new Error("Not enough data to read byte array");
  }
  const bytes = asReference
    ? buf.content.subarray(buf.offset, buf.offset + length)
    : buf.content.slice(buf.offset, buf.offset + length);
  buf.offset += length;
  return bytes;
}

export function addByteArray8<B extends Buffer>(buf: B, bytes: Uint8Array): B {
  addUInt8(buf, bytes.length);
  addByteArrayN(buf, bytes);
  return buf;
}

export function readByteArray8(buf: Buffer, asReference = false): Uint8Array {
  const length = readUInt8(buf);
  return readByteArrayN(buf, length, asReference);
}

export function addByteArray16<B extends Buffer>(buf: B, bytes: Uint8Array): B {
  addUInt16(buf, bytes.length);
  addByteArrayN(buf, bytes);
  return buf;
}

export function readByteArray16(buf: Buffer, asReference = false): Uint8Array {
  const length = readUInt16(buf);
  return readByteArrayN(buf, length, asReference);
}

export function addByteArray32<B extends Buffer>(buf: B, bytes: Uint8Array): B {
  addUInt32(buf, bytes.length);
  addByteArrayN(buf, bytes);
  return buf;
}

export function readByteArray32(buf: Buffer, asReference = false): Uint8Array {
  const length = readUInt32(buf);
  return readByteArrayN(buf, length, asReference);
}

export function addByteArray64<B extends Buffer>(buf: B, bytes: Uint8Array): B {
  addUInt64(buf, bytes.length);
  addByteArrayN(buf, bytes);
  return buf;
}

export function readByteArray64(buf: Buffer, asReference = false): Uint8Array {
  const length = readUInt64(buf);
  return readByteArrayN(buf, length, asReference);
}
