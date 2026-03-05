import { Buffer } from "./buffer.js";

export function addUInt8<B extends Buffer>(buf: B, n: number): B {
  buf.addOne(n);
  return buf;
}

export function readUInt8(buf: Buffer): number {
  if (buf.offset >= buf.length) {
    throw new Error("Not enough data to read uint8");
  }
  return buf.get(buf.offset++);
}

export function addInt8<B extends Buffer>(buf: B, n: number): B {
  buf.addOne(n);
  return buf;
}

export function readInt8(buf: Buffer): number {
  if (buf.offset >= buf.size) {
    throw new Error("Not enough data to read int8");
  }
  const value = buf.dataView.getInt8(buf.offset);
  buf.offset++;
  return value;
}

export function addUInt16<B extends Buffer>(buf: B, n: number): B {
  buf.dataView.setUint16(buf.offset, n, true);
  buf.offset += 2;
  return buf;
}

export function readUInt16(buf: Buffer): number {
  if (buf.offset + 2 > buf.content.length) {
    throw new Error("Not enough data to read uint16");
  }
  const value = buf.dataView.getUint16(buf.offset, true);
  buf.offset += 2;
  return value;
}

export function addInt16<B extends Buffer>(buf: B, n: number): B {
  buf.dataView.setInt16(buf.offset, n, true);
  buf.offset += 2;
  return buf;
}

export function readInt16(buf: Buffer): number {
  if (buf.offset + 2 > buf.content.length) {
    throw new Error("Not enough data to read int16");
  }
  const value = buf.dataView.getInt16(buf.offset, true);
  buf.offset += 2;
  return value;
}

export function addUInt32<B extends Buffer>(buf: B, n: number): B {
  buf.dataView.setUint32(buf.offset, n, true);
  buf.offset += 4;
  return buf;
}

export function readUInt32(buf: Buffer): number {
  if (buf.offset + 4 > buf.content.length) {
    throw new Error("Not enough data to read uint32");
  }
  const value = buf.dataView.getUint32(buf.offset, true);
  buf.offset += 4;
  return value;
}

export function addInt32<B extends Buffer>(buf: B, n: number): B {
  buf.dataView.setInt32(buf.offset, n, true);
  buf.offset += 4;
  return buf;
}

export function readInt32(buf: Buffer): number {
  if (buf.offset + 4 > buf.content.length) {
    throw new Error("Not enough data to read int32");
  }
  const value = buf.dataView.getInt32(buf.offset, true);
  buf.offset += 4;
  return value;
}

export function addUInt64<B extends Buffer>(buf: B, n: number): B {
  buf.dataView.setUint32(buf.offset, n & 0xffffffff, true);
  buf.dataView.setUint32(buf.offset + 4, n / 0x100000000, true);
  buf.offset += 8;
  return buf;
}

export function readUInt64(buf: Buffer): number {
  if (buf.offset + 8 > buf.content.length) {
    throw new Error("Not enough data to read uint64");
  }
  const lower = buf.dataView.getUint32(buf.offset, true);
  const upper = buf.dataView.getUint32(buf.offset + 4, true);
  buf.offset += 8;
  return upper * 0x100000000 + lower;
}

export function addInt64<B extends Buffer>(buf: B, n: number): B {
  const lower = n & 0xffffffff;
  const upper = Math.floor(n / 0x100000000);
  buf.dataView.setUint32(buf.offset, lower >>> 0, true);
  buf.dataView.setInt32(buf.offset + 4, upper, true);
  buf.offset += 8;
  return buf;
}

export function readInt64(buf: Buffer): number {
  if (buf.offset + 8 > buf.content.length) {
    throw new Error("Not enough data to read int64");
  }
  const lower = buf.dataView.getUint32(buf.offset, true);
  const upper = buf.dataView.getInt32(buf.offset + 4, true);
  buf.offset += 8;
  return upper * 0x100000000 + lower;
}
